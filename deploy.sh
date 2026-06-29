#!/bin/bash

echo "🚀 Pushing to GitHub..."
git push origin main

echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Done! Your changes are live!"
