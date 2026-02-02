export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    // ROUTING LOGIC
    // Flux models
    if (url.pathname === "/flux-klein") {
      return handleImageGeneration(request, env, "@cf/black-forest-labs/flux-2-klein-9b", corsHeaders);
    }
    
    if (url.pathname === "/flux-dev" || url.pathname === "/") {
      return handleImageGeneration(request, env, "@cf/black-forest-labs/flux-2-dev", corsHeaders);
    }

    // Leonardo AI - Lucid Origin
    if (url.pathname === "/lucid-origin") {
      return handleImageGeneration(request, env, "@cf/leonardo/lucid-origin", corsHeaders);
    }

    // Lykon - DreamShaper
    if (url.pathname === "/dreamshaper") {
      return handleImageGeneration(request, env, "@cf/lykon/dreamshaper-8-lcm", corsHeaders);
    }

    // Stable Diffusion variants
    if (url.pathname === "/stable-diffusion-img2img") {
      return handleImageGeneration(request, env, "@cf/runwayml/stable-diffusion-v1-5-img2img", corsHeaders);
    }

    if (url.pathname === "/stable-diffusion-xl-lightning") {
      return handleImageGeneration(request, env, "@cf/bytedance/stable-diffusion-xl-lightning", corsHeaders);
    }

    if (url.pathname === "/stable-diffusion-xl-base") {
      return handleImageGeneration(request, env, "@cf/stabilityai/stable-diffusion-xl-base-1.0", corsHeaders);
    }

    // 404 for unknown paths
    return new Response(JSON.stringify({ 
      error: "Endpoint not found",
      available_endpoints: [
        "/flux-klein - Flux 2 Klein 9B",
        "/flux-dev - Flux 2 Dev (default)",
        "/lucid-origin - Leonardo AI Lucid Origin",
        "/dreamshaper - Lykon DreamShaper 8 LCM",
        "/stable-diffusion-img2img - Stable Diffusion v1.5 img2img",
        "/stable-diffusion-xl-lightning - SDXL Lightning",
        "/stable-diffusion-xl-base - SDXL Base 1.0"
      ]
    }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  },
};

/**
 * Reusable function to handle image generation for any model
 */
async function handleImageGeneration(request, env, modelId, corsHeaders) {
  const url = new URL(request.url);
  let prompt = "";
  let width = 1024;
  let height = 1024;
  let negative_prompt = "";
  let guidance = null;
  let num_steps = null;
  let seed = null;
  let strength = null;

  // Parse parameters based on method
  if (request.method === "GET") {
    prompt = url.searchParams.get("prompt");
    width = parseInt(url.searchParams.get("width")) || 1024;
    height = parseInt(url.searchParams.get("height")) || 1024;
    negative_prompt = url.searchParams.get("negative_prompt") || "";
    guidance = url.searchParams.get("guidance") ? parseFloat(url.searchParams.get("guidance")) : null;
    num_steps = url.searchParams.get("num_steps") ? parseInt(url.searchParams.get("num_steps")) : null;
    seed = url.searchParams.get("seed") ? parseInt(url.searchParams.get("seed")) : null;
    strength = url.searchParams.get("strength") ? parseFloat(url.searchParams.get("strength")) : null;
  } else if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    prompt = body?.prompt;
    width = parseInt(body?.width) || 1024;
    height = parseInt(body?.height) || 1024;
    negative_prompt = body?.negative_prompt || "";
    guidance = body?.guidance || null;
    num_steps = body?.num_steps || body?.steps || null;
    seed = body?.seed || null;
    strength = body?.strength || null;
  }

  // Validate prompt
  if (!prompt) {
    return new Response(
      JSON.stringify({ error: "Prompt is required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Set default dimensions based on model
  if (modelId.includes("lucid-origin")) {
    // Lucid Origin defaults to 1120x1120
    width = width === 1024 ? 1120 : width;
    height = height === 1024 ? 1120 : height;
  }

  // Validate resolution (ensure reasonable limits)
  const maxDimension = modelId.includes("lucid-origin") ? 2500 : 2048;
  if (width < 256 || width > maxDimension || height < 256 || height > maxDimension) {
    return new Response(
      JSON.stringify({ 
        error: "Invalid resolution", 
        details: `Width and height must be between 256 and ${maxDimension} pixels` 
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Ensure dimensions are multiples of 8 (common requirement for AI models)
  if (width % 8 !== 0 || height % 8 !== 0) {
    return new Response(
      JSON.stringify({ 
        error: "Invalid resolution", 
        details: "Width and height must be multiples of 8" 
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Build inputs object based on model requirements
    const inputs = {
      prompt: prompt,
      width: width,
      height: height
    };

    // Add optional parameters if provided
    if (negative_prompt) {
      inputs.negative_prompt = negative_prompt;
    }
    if (guidance !== null) {
      inputs.guidance = guidance;
    }
    if (num_steps !== null) {
      inputs.num_steps = num_steps;
    }
    if (seed !== null) {
      inputs.seed = seed;
    }
    if (strength !== null) {
      inputs.strength = strength;
    }

    // Generate image using Cloudflare AI
    const result = await env.AI.run(modelId, inputs);

    // Handle different response formats
    let imageData;
    if (result.image) {
      // Model returns { image: "base64string" }
      imageData = result.image;
    } else if (result instanceof ReadableStream) {
      // Model returns a stream - convert to base64
      const arrayBuffer = await new Response(result).arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      imageData = base64;
    } else {
      throw new Error("Unexpected response format from AI model");
    }

    // Return the image as a data URL in JSON format
    const dataUrl = `data:image/jpeg;base64,${imageData}`;
    
    return new Response(
      JSON.stringify({
        success: true,
        model: modelId,
        image: dataUrl,
        width: width,
        height: height,
        prompt: prompt
      }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
      }
    );
  } catch (err) {
    // Check if it's a content moderation error
    if (err.message && err.message.includes('3030')) {
      return new Response(
        JSON.stringify({ 
          error: "Content moderation flag", 
          details: "Your prompt was flagged by the content filter. Try rephrasing or adding more descriptive, artistic language.",
          prompt: prompt,
          suggestion: "Try being more specific about style, lighting, or composition (e.g., 'digital art of', 'photograph of', 'illustration of')"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Image generation failed", details: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
