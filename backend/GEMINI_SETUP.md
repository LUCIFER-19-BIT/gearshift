# Google Gemini Car Brand Validation Setup

This document explains how to set up and use the Google Gemini API integration for validating that only Tata brand cars can be uploaded to the CarCircle platform.

## Features

✅ **Automatic Brand Detection**: Uses Google Gemini Vision AI to identify car brand from uploaded images  
✅ **Tata-Only Filter**: Only allows Tata vehicles to be uploaded  
✅ **Smart Validation**: Checks multiple images for better accuracy  
✅ **Automatic Cleanup**: Deletes uploaded files if validation fails  
✅ **Detailed Error Messages**: Provides clear feedback to users about detected brands  

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated API key

### 2. Configure Environment Variables

Open `backend/.env` file and replace the placeholder with your actual API key:

```env
GEMINI_API_KEY="your_actual_api_key_here"
```

### 3. Install Dependencies

Navigate to the backend directory and install the Google Generative AI package:

```bash
cd backend
npm install
```

This will install `@google/generative-ai` which has already been added to `package.json`.

### 4. Restart the Server

If your server is running, restart it to load the new environment variable:

```bash
npm start
```

## How It Works

### Workflow

1. **User uploads car images** → Images are saved to disk by Multer
2. **Gemini validates brand** → AI analyzes images to identify car brand
3. **Decision made**:
   - ✅ **If Tata**: Upload proceeds, listing is created
   - ❌ **If other brand**: Images are deleted, user gets error message
   - ⚠️ **If unclear**: Images are deleted, user asked for clearer photos

### Middleware Chain

```
POST /api/carcircle
  ↓
auth (check JWT token)
  ↓
uploadCarCircleImages (save images with Multer)
  ↓
validateCarBrand (check if car is Tata using Gemini) ← NEW
  ↓
createCarCircleListing (save to database)
```

### Supported Tata Models

The AI is trained to recognize these Tata vehicles:
- Tata Nexon
- Tata Punch
- Tata Safari
- Tata Harrier
- Tata Altroz
- Tata Tiago
- Tata Tigor
- Tata Curvv
- And other Tata models

### Error Messages

Users will see different messages based on detection results:

| Scenario | Message |
|----------|---------|
| Tata car detected | ✅ "Tata [model] detected successfully" |
| Other brand detected | ❌ "Only Tata vehicles are allowed. Detected brand: [brand]" |
| Brand unclear | ⚠️ "Unable to clearly identify the car brand. Please upload clearer images" |
| API error | ⚠️ "Error validating car brand. Please try again." |

## Technical Details

### Files Modified/Created

**Created:**
- `backend/library/geminiValidator.js` - Gemini validation logic

**Modified:**
- `backend/controllers/carCircleController.js` - Added validateCarBrand middleware
- `backend/index.js` - Added middleware to routes
- `backend/package.json` - Added @google/generative-ai dependency
- `backend/.env` - Added GEMINI_API_KEY

### API Usage

- **Model**: `gemini-1.5-flash` (fast and cost-effective)
- **Images analyzed**: First 3 images (for efficiency)
- **Response format**: JSON with brand, model, confidence, and reasoning

### Cost Considerations

Gemini 1.5 Flash pricing (as of 2024):
- **Free tier**: 15 requests per minute, 1500 per day
- **Paid tier**: Very affordable for production use

For most use cases, the free tier is sufficient.

## Testing

### Test with Tata Car

Upload images of any Tata vehicle (Nexon, Punch, Safari, etc.). The upload should succeed.

### Test with Non-Tata Car

Upload images of other brands (Honda, Maruti, Hyundai, etc.). You should see:

```json
{
  "message": "Only Tata vehicles are allowed. Detected brand: Honda. This platform is exclusively for Tata car listings.",
  "detectedBrand": "Honda"
}
```

### Test with Unclear Images

Upload blurry or unclear car images. You should see:

```json
{
  "message": "Unable to clearly identify the car brand. Please upload clearer images showing the car's brand logo and design."
}
```

## Troubleshooting

### Issue: "Car brand validation is not configured"

**Solution**: Make sure you've added a valid `GEMINI_API_KEY` to your `.env` file and restarted the server.

### Issue: API rate limit exceeded

**Solution**: You've exceeded the free tier limit. Either wait for the limit to reset or upgrade to a paid plan.

### Issue: All uploads are rejected

**Solution**: 
1. Check that your API key is valid
2. Ensure the uploaded images clearly show the car brand/logo
3. Check the server logs for detailed error messages

## Security Notes

- ⚠️ **Never commit your API key to git**
- ✅ The `.env` file should be in `.gitignore`
- ✅ Files are automatically deleted if validation fails (no orphaned uploads)
- ✅ Validation happens on the backend (cannot be bypassed by frontend manipulation)

## Future Enhancements

Possible improvements:
- [ ] Cache validation results to avoid re-checking the same images
- [ ] Add support for multiple allowed brands (configurable)
- [ ] Store detected brand/model in database for analytics
- [ ] Add user feedback mechanism for incorrect detections

## Support

For issues or questions:
1. Check the server logs for detailed error messages
2. Verify your Gemini API key is valid
3. Ensure images are clear and show the car brand prominently
