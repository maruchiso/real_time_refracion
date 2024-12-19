#version 130

//Tekstury wejsciowe
uniform sampler2D color_texture;
uniform sampler2D depth_texture;

//Parametry kamery
uniform vec2 camera_nearfar;
uniform float refractive_index;

//Dane wejsciowe z shadera vertex
in vec2 texcoord;

//Dane wyjsciowe
out vec4 fragColor;

//TODO mapa normalnych, iterative mode przetestować, a dopiero potem finalny algorytm

void main() {
    
    float scene_depth = texture(depth_texture, texcoord).r; //Glebia
    
    float near = camera_nearfar.x; 
    float far = camera_nearfar.y;
    
    //Wyliczenie glebokosci na rzeczywista odleglosc
    float z = (2.0 * near * far) / (far + near - (2.0 * scene_depth - 1.0) * (far - near));
    
    vec2 refracted_coords = texcoord; 

    for (int i = 0; i < 5; i++) {
        float new_depth = texture(depth_texture, refracted_coords).r;
        float new_z = (2.0 * near * far) / (far + near - (2.0 * new_depth - 1.0) * (far - near));
        if (abs(new_z - z) < 0.01) break;
        refracted_coords += vec2(0.01, 0.01) * (1.0 / refractive_index);
    }

    vec4 color = texture(color_texture, refracted_coords);
    fragColor = color;
}