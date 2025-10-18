# How to Get Direct Image URLs from Google Images 🖼️

## The Problem:
When you right-click and "Copy image address" from Google Images search results, you get a **redirect URL** like:
```
https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.healthshots.com...
```
This won't work in React Native! ❌

## The Solution - Get Direct Image URLs:

### Method 1: Right-Click on the Image (Recommended)
1. Go to Google Images and search for your yoga pose
2. Click on the image you want
3. In the preview panel on the right, **right-click directly on the large image**
4. Select **"Open image in new tab"**
5. Copy the URL from that new tab - this is the DIRECT image URL! ✅
6. It should look like: `https://www.healthshots.com/wp-content/uploads/2023/...balasana.jpg`

### Method 2: Visit the Source Website
1. From Google Images, click **"Visit"** button under the image
2. Find the image on the source website
3. Right-click on the image → **"Open image in new tab"**
4. Copy that URL

### Method 3: Use "View Image" (if available)
1. Some browsers have a "View Image" button in Google Images
2. Click it to open the direct image
3. Copy the URL

## Example - Getting Balasana (Child's Pose) Image:

### ❌ Wrong URL (Google redirect):
```
https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.healthshots.com%2Ffitness%2Fstaying-fit%2Fbalasana-childs-pose-benefits%2F&psig=AOvVaw2FoaEQaqoFu-DPVMyHTAk9&ust=1760902955280000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKi75YPBrpADFQAAAAAdAAAAABAE
```

### ✅ Correct URL (Direct image):
```
https://www.healthshots.com/wp-content/uploads/2023/05/balasana-childs-pose.jpg
```

## Your Specific Images:

Based on your Google search URLs, here are the websites you wanted:

1. **Child's Pose** - healthshots.com
2. **Cat-Cow Stretch** - popsugar.com  
3. **Warrior II** - shvasa.com
4. **Tree Pose** - myyogateacher.com
5. **Cobra Pose** - rishikeshashtangayogaschool.com
6. **Bridge Pose** - gynaecworld.com
7. **Legs Up Wall** - stylecraze.com
8. **Seated Forward Bend** - vinyasayogaacademy.com

## Quick Fix Options:

### Option A: I can search for direct URLs from these sites
Let me know and I'll find the direct image URLs from these specific websites.

### Option B: You provide the direct URLs
1. Visit each website listed above
2. Find the yoga pose image
3. Right-click → "Open image in new tab"
4. Send me the direct URLs
5. I'll update the code immediately!

### Option C: Use image hosting
1. Download the images you want from Google
2. Upload them to your project in `PcoSense/assets/yoga/`
3. Use local images: `require('../../assets/yoga/balasana.jpg')`

## Which option do you prefer? 🤔

