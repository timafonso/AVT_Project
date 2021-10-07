#version 330

out vec4 colorOut;

struct Materials {
	vec4 diffuse;
	vec4 ambient;
	vec4 specular;
	vec4 emissive;
	float shininess;
	int texCount;
};

uniform Materials mat;

struct DirectionalLight {
	vec4 direction;
	bool on;
};

struct SpotLight {
	vec4 position;
	vec4 direction;
	bool on;
	float cutOff;
};

//in Light pointlights[6];
in DirectionalLight dirlight;
in SpotLight spotlights;

in Data {
	vec3 normal;
	vec3 eye;
	vec3 lightDir;
} DataIn;


void main() {

	vec4 spec = vec4(0.0);
	vec4 diffuse = vec4(0.0);

	vec3 n = normalize(DataIn.normal);
	vec3 l = normalize(DataIn.lightDir);
	vec3 dir_l = normalize(vec3(dirlight.direction));
	vec3 spot_dir = normalize(vec3(spotlights.direction));
	vec3 e = normalize(DataIn.eye);

	float dirIntensity = 0.0f;
	if(dirlight.on) {
		dirIntensity = max(dot(n, dir_l), 0.0);
		if(dirIntensity > 0.0) {
			vec3 h = normalize(dir_l + e);
			float intSpec = max(dot(h,n), 0.0);
			spec += mat.specular * pow(intSpec, mat.shininess);
			diffuse += mat.diffuse * dirIntensity;
		}
	}

	float spotIntensity = 0.0f;
	spotIntensity = max(dot(n, l), 0.0);
	if(dot(spot_dir, l) > 0.866) {
		if (spotIntensity > 0.0) {
			vec3 h = normalize(l + e);
			float intSpec = max(dot(h,n), 0.0);
			spec += mat.specular * pow(intSpec, mat.shininess);
			diffuse += mat.diffuse * spotIntensity;
		}
	}

	colorOut = max((dirIntensity+spotIntensity) * diffuse + spec, mat.ambient);
}