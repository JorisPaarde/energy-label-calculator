#!/bin/bash

echo "Building Energy Label Calculator Plugin..."
echo

# Build the plugin
npm run build:plugin

echo
echo "Build complete! Check the dist/ folder for the plugin files."
echo

# Check if the plugin was built successfully
if [ -f "dist/energy-label-calculator.zip" ]; then
    echo "Plugin ZIP file created successfully!"
    echo
    
    # Copy to Windows OneDrive folder via WSL
    echo "Copying to Windows OneDrive folder via WSL..."
    WINDOWS_PATH="/mnt/c/Users/Gebruiker/OneDrive/Documents/1_JPWebCreation/devprojects/label calculator"
    
    # Create Windows directory if it doesn't exist
    mkdir -p "$WINDOWS_PATH"
    
    # Copy the plugin
    if cp "dist/energy-label-calculator.zip" "$WINDOWS_PATH/"; then
        echo "Plugin copied to Windows OneDrive folder successfully!"
        echo "Location: $WINDOWS_PATH/energy-label-calculator.zip"
    else
        echo "Failed to copy to Windows OneDrive folder. Please check the path and try again."
    fi
else
    echo "Plugin build failed! Please check the error messages above."
fi

echo
echo "Press Enter to continue..."
read
