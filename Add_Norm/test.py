from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import torch.nn.functional as F    

app = Flask(__name__)

class AddAndNormalizeLayer(nn.Module):
    def __init__(self, input_size):
        super(AddAndNormalizeLayer, self).__init__()
        self.learned_tensor = nn.Parameter(torch.randn(input_size))

    def forward(self, x):
        added_output = x + self.learned_tensor
        normalized_output = F.layer_norm(added_output, added_output.size()[1:])
        return normalized_output

# Global variables to hold the layer and input size
add_norm_layer = None
input_size = None

# Helper function to format the response
def format_response(input_tensor, learned_tensor, added_tensor, normalized_output):
    return {
        "input_tensor": [float(x) for x in input_tensor.squeeze()],
        "learned_tensor": [float(x) for x in learned_tensor],
        "added_tensor": [float(x) for x in added_tensor.squeeze()],
        "normalized_output": [float(x) for x in normalized_output.squeeze()]
    }

# Helper function to calculate statistics
def calculate_statistics(added_tensor):
    mean = added_tensor.mean().item()
    variance = ((added_tensor - mean) ** 2).sum().item() / (added_tensor.size(1) - 1)
    std_dev = torch.sqrt(torch.tensor(variance)).item()
    return mean, std_dev   


@app.route('/AI-API/process', methods=['POST'])
def process_input_with_details():
    global input_size, add_norm_layer

    try:
        # Get the input data from the request
        data = request.json
        input_list = data['numbers']
        input_tensor = torch.tensor(input_list, dtype=torch.float32).unsqueeze(0)

        print(f"Input Tensor Shape: {input_tensor.shape}")

        # Initialize the layer if not already done
        if input_size is None or add_norm_layer is None:
            input_size = input_tensor.size(1)
            add_norm_layer = AddAndNormalizeLayer(input_size)
            print("Initialized AddAndNormalizeLayer.")

        # Ensure shapes are compatible
        if input_tensor.size(1) != add_norm_layer.learned_tensor.size(0):
            return jsonify({"error": "Shape mismatch between input tensor and learned tensor"}), 400

        print(f"Learned Tensor Shape: {add_norm_layer.learned_tensor.shape}")

        # Process the input tensor
        added_tensor = input_tensor + add_norm_layer.learned_tensor
        normalized_output = add_norm_layer(input_tensor)
        mean, std_dev = calculate_statistics(added_tensor)

        # Format the response
        response = format_response(input_tensor, add_norm_layer.learned_tensor, added_tensor, normalized_output)
        response.update({
            "mean": mean,
            "std_dev": std_dev,
            "normalization_steps": {
                "step_1": f"Start with the input tensor: {input_list}",
                "step_2": f"Add the learned tensor: {add_norm_layer.learned_tensor.tolist()} to the input tensor to get the added tensor.",
                "step_3": f"The resulting added tensor is: {added_tensor.squeeze().tolist()}",
                "step_4": f"Calculate the mean of the added tensor: {mean}",
                "step_5": f"Calculate the standard deviation of the added tensor: {std_dev}",
                "step_6": f"Normalize the added tensor using layer normalization to get the normalized output."
            }
        })

        return jsonify(response)

    except Exception as e:
        # Log the exception and return a 500 error with a custom message
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

