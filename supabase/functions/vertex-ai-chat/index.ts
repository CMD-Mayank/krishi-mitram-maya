import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPrompt, imageBase64, endpointId, projectId } = await req.json();
    
    console.log('Received request:', { userPrompt, hasImage: !!imageBase64, endpointId, projectId });

    // Get Vertex AI access token from environment
    const accessToken = Deno.env.get('VERTEX_AI_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('VERTEX_AI_ACCESS_TOKEN not configured');
    }

    // Default values if not provided
    const region = "us-central1";
    const finalEndpointId = endpointId || "YOUR_ENDPOINT_ID";
    const finalProjectId = projectId || "YOUR_PROJECT_ID";

    const vertexUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${finalProjectId}/locations/${region}/endpoints/${finalEndpointId}:predict`;

    // Prepare payload
    const instances: any[] = [{
      prompt: userPrompt
    }];

    // Add image if provided
    if (imageBase64) {
      instances[0].image = {
        bytesBase64Encoded: imageBase64
      };
    }

    const payload = {
      instances,
      parameters: {
        temperature: 0.7,
        maxOutputTokens: 512
      }
    };

    console.log('Making request to Vertex AI:', vertexUrl);

    const response = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI API error:', response.status, errorText);
      throw new Error(`Vertex AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Vertex AI response:', data);

    const prediction = data.predictions?.[0];
    if (!prediction) {
      throw new Error('No predictions returned from Vertex AI');
    }

    return new Response(JSON.stringify({
      status: "success",
      output: prediction,
      message: prediction.content || prediction.text || "Response received from Vertex AI"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vertex-ai-chat function:', error);
    
    return new Response(JSON.stringify({
      status: "error",
      error: error.message,
      output: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});