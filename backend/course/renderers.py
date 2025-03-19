from rest_framework import renderers
import json

class CourseRenderer(renderers.JSONRenderer):
    # Set the charset to UTF-8 for proper encoding of the response
    charset = 'utf-8'
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        # Initialize an empty string for the response
        response = ''
        
        # Check if the data contains 'ErrorDetail' (which indicates DRF validation errors)
        if 'ErrorDetail' in str(data):
            # If errors are found, format the response with an 'errors' key to wrap the errors
            response = json.dumps({'errors': data})
        else:
            # If no errors are found, just convert the data into JSON format
            response = json.dumps(data)
        
        # Return the formatted response as a JSON string
        return response
