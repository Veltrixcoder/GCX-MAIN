# Cloudflare AI Image Generation Worker

A comprehensive Cloudflare Worker that provides access to multiple AI image generation models through simple API endpoints.

## Available Models & Endpoints

### 1. Flux 2 Dev (Default)
**Endpoint:** `/flux-dev` or `/`  
**Model ID:** `@cf/black-forest-labs/flux-2-dev`  
**Description:** The current/original Flux Dev model

### 2. Flux 2 Klein 9B
**Endpoint:** `/flux-klein`  
**Model ID:** `@cf/black-forest-labs/flux-2-klein-9b`  
**Description:** The new Klein model from Black Forest Labs

### 3. Leonardo AI - Lucid Origin
**Endpoint:** `/lucid-origin`  
**Model ID:** `@cf/leonardo/lucid-origin`  
**Description:** Most adaptable and prompt-responsive model from Leonardo.AI. Great for sharp graphic design, full-HD renders, and highly specific creative direction.
- **Default dimensions:** 1120x1120
- **Max dimensions:** 2500x2500
- **Pricing:** $0.007 per 512x512 tile, $0.00013 per step

### 4. DreamShaper 8 LCM
**Endpoint:** `/dreamshaper`  
**Model ID:** `@cf/lykon/dreamshaper-8-lcm`  
**Description:** Stable Diffusion model fine-tuned for better photorealism without sacrificing range.
- **Max dimensions:** 2048x2048
- **Free:** $0.00 per step

### 5. Stable Diffusion v1.5 img2img
**Endpoint:** `/stable-diffusion-img2img`  
**Model ID:** `@cf/runwayml/stable-diffusion-v1-5-img2img`  
**Description:** Generate new images from input images with Stable Diffusion (img2img task).
- **Max dimensions:** 2048x2048
- **Free:** $0.00 per step
- **Status:** Beta

### 6. SDXL Lightning
**Endpoint:** `/stable-diffusion-xl-lightning`  
**Model ID:** `@cf/bytedance/stable-diffusion-xl-lightning`  
**Description:** Lightning-fast text-to-image generation. Generates high-quality 1024px images in a few steps.
- **Max dimensions:** 2048x2048
- **Free:** $0.00 per step
- **Status:** Beta

### 7. SDXL Base 1.0
**Endpoint:** `/stable-diffusion-xl-base`  
**Model ID:** `@cf/stabilityai/stable-diffusion-xl-base-1.0`  
**Description:** Diffusion-based text-to-image generative model by Stability AI.
- **Max dimensions:** 2048x2048
- **Free:** $0.00 per step
- **Status:** Beta

## API Usage

### GET Request
```bash
# Basic usage
curl "https://your-worker.workers.dev/flux-klein?prompt=cyberpunk+cat"

# With custom dimensions
curl "https://your-worker.workers.dev/lucid-origin?prompt=mountain+landscape&width=1120&height=1120"

# With additional parameters
curl "https://your-worker.workers.dev/dreamshaper?prompt=portrait&width=512&height=768&guidance=7.5&num_steps=20"
```

### POST Request
```bash
curl -X POST https://your-worker.workers.dev/stable-diffusion-xl-base \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a serene lake at sunset",
    "width": 1024,
    "height": 1024,
    "guidance": 7.5,
    "num_steps": 20,
    "seed": 42
  }'
```

## Parameters

### Required
- **prompt** (string): Text description of the image you want to generate

### Optional
- **width** (integer): Image width in pixels (default: 1024, must be multiple of 8)
- **height** (integer): Image height in pixels (default: 1024, must be multiple of 8)
- **negative_prompt** (string): Text describing elements to avoid in the generated image
- **guidance** (number): How closely the image should adhere to the prompt (default varies by model)
- **num_steps** (integer): Number of diffusion steps (max: 20 for most models, 40 for Lucid Origin)
- **seed** (integer): Random seed for reproducibility
- **strength** (number): For img2img tasks, controls transformation strength (0-1)

## Response Format

```json
{
  "success": true,
  "model": "@cf/black-forest-labs/flux-2-klein-9b",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "width": 1024,
  "height": 1024,
  "prompt": "cyberpunk cat"
}
```

## Error Handling

### Content Moderation Error
```json
{
  "error": "Content moderation flag",
  "details": "Your prompt was flagged by the content filter...",
  "prompt": "...",
  "suggestion": "Try being more specific about style, lighting, or composition..."
}
```

### Invalid Resolution Error
```json
{
  "error": "Invalid resolution",
  "details": "Width and height must be between 256 and 2048 pixels"
}
```

### Missing Prompt Error
```json
{
  "error": "Prompt is required"
}
```

## Model Selection Guide

- **Fast generation with good quality:** `/stable-diffusion-xl-lightning`
- **Best photorealism:** `/dreamshaper`
- **Highly responsive to prompts:** `/lucid-origin`
- **General purpose, balanced:** `/flux-dev` (default)
- **Compact, efficient:** `/flux-klein`
- **Image-to-image transformation:** `/stable-diffusion-img2img`
- **Stable and reliable:** `/stable-diffusion-xl-base`

## CORS Support

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Examples

### JavaScript/TypeScript
```javascript
// Fetch with GET
const response = await fetch(
  'https://your-worker.workers.dev/lucid-origin?prompt=fantasy+castle&width=1120&height=1120'
);
const data = await response.json();
const imageElement = document.createElement('img');
imageElement.src = data.image;

// Fetch with POST
const response = await fetch('https://your-worker.workers.dev/dreamshaper', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'beautiful sunset over ocean',
    width: 1024,
    height: 768,
    guidance: 7.5,
    negative_prompt: 'blurry, low quality'
  })
});
const data = await response.json();
```

### Python
```python
import requests
import base64
from io import BytesIO
from PIL import Image

# POST request
response = requests.post(
    'https://your-worker.workers.dev/stable-diffusion-xl-base',
    json={
        'prompt': 'cyberpunk cityscape at night',
        'width': 1024,
        'height': 1024,
        'guidance': 7.5,
        'seed': 12345
    }
)

data = response.json()
# Extract base64 image data
image_data = data['image'].split(',')[1]
image = Image.open(BytesIO(base64.b64decode(image_data)))
image.save('output.jpg')
```

## Deployment

1. Create a new Cloudflare Worker
2. Copy the code from `worker.js`
3. Add the AI binding to your worker:
   - Go to Settings > Variables
   - Add AI binding named `AI`
4. Deploy the worker

## Notes

- All dimensions must be multiples of 8
- Different models have different maximum dimensions (2048 or 2500)
- Some models are in Beta and may have different behaviors
- Lucid Origin is a paid model ($0.007 per 512x512 tile)
- All other listed models are currently free ($0.00 per step)
