# Cloudflare R2 Setup Guide

## Environment Variables Configuration

Based on your R2 API token creation, here's how to configure your `.env` file:

### Option 1: Using Direct Endpoint (Recommended)

```env
# Use the full endpoint URL from your R2 credentials
R2_ENDPOINT=https://1bc59111ae72289c8778e9ed0b1dcfb1.r2.cloudflarestorage.com

# Or use account ID (extract from endpoint URL)
# R2_ACCOUNT_ID=1bc59111ae72289c8778e9ed0b1dcfb1

# S3-compatible credentials
R2_ACCESS_KEY_ID=908fca47c...  # Full Access Key ID from your credentials
R2_SECRET_ACCESS_KEY=ae6973661f50....  # Full Secret Access Key from your credentials

# Your R2 bucket name (create one in Cloudflare dashboard if you haven't)
R2_BUCKET_NAME=legislative-intake

# Optional: Public URL for accessing files (if you set up a custom domain)
# Otherwise, files will be accessed via signed URLs
R2_PUBLIC_URL=https://your-bucket.your-domain.com
```

### Option 2: Using Account ID

If you prefer to use the account ID approach:

```env
# Account ID extracted from endpoint URL (the part before .r2.cloudflarestorage.com)
R2_ACCOUNT_ID=1bc59111ae72289c8778e9ed0b1dcfb1

# S3-compatible credentials
R2_ACCESS_KEY_ID=908fca47c...  # Full Access Key ID
R2_SECRET_ACCESS_KEY=ae6973661f50....  # Full Secret Access Key

# Your R2 bucket name
R2_BUCKET_NAME=legislative-intake

# Optional: Public URL
R2_PUBLIC_URL=https://your-bucket.your-domain.com
```

## Important Notes

1. **Token Value vs Account ID**: 
   - The "Token value" (FLUmVx...) is NOT the account ID
   - The account ID is `1bc59111ae72289c8778e9ed0b1dcfb1` (from your endpoint URL)
   - Use the **Access Key ID** and **Secret Access Key** for S3 client authentication

2. **Create a Bucket**:
   - Go to Cloudflare Dashboard → R2
   - Create a bucket (e.g., `legislative-intake`)
   - Set `R2_BUCKET_NAME` to your bucket name

3. **Full Credentials**:
   - Make sure you copy the FULL Access Key ID and Secret Access Key
   - They may be truncated in the UI with "..."
   - Click "Click to copy" to get the complete values

4. **Public URL** (Optional):
   - If you want public file access, set up a custom domain in R2
   - Otherwise, files are accessed via signed URLs (which is more secure)

## Testing Your Configuration

After setting up your `.env` file, restart your Next.js dev server:

```bash
npm run dev
# or
pnpm dev
```

Then try uploading a bill. If you still get SSL errors, check:
- All credentials are complete (not truncated)
- Bucket name matches exactly
- Endpoint URL is correct
- Your R2 bucket exists and is accessible

