import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const componentsParam = searchParams.get('components');
        
        const componentsDir = path.join(process.cwd(), 'src', 'app', 'builderElements');
        
        // All available components
        const allComponentNames = ['Banner', 'Block', 'Button', 'Categories', 'Checkbox', 'Divider', 'Icon', 'Image', 'Modal', 'Text'];
        
        // If components parameter is provided, filter to only include those
        let componentNamesToInclude = allComponentNames;
        if (componentsParam) {
            // Parse the comma-separated list and normalize to title case
            const requestedComponents = componentsParam
                .split(',')
                .map(c => c.trim())
                .filter(Boolean)
                .map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase());
            
            // Only include components that are both requested and available
            componentNamesToInclude = allComponentNames.filter(name => 
                requestedComponents.includes(name)
            );
        }
        
        let combinedCSS = '';
        
        for (const componentName of componentNamesToInclude) {
            const cssFilePath = path.join(componentsDir, componentName, `${componentName}.css`);
            
            try {
                if (fs.existsSync(cssFilePath)) {
                    const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
                    if (cssContent.trim()) {
                        combinedCSS += cssContent + '\n';
                    }
                }
            } catch (error) {
                console.error(`Error reading CSS file for ${componentName}:`, error);
            }
        }
        
        return NextResponse.json({ css: combinedCSS.trim() });
    } catch (error) {
        console.error('Error in builder-elements-css API:', error);
        return NextResponse.json({ error: 'Failed to read CSS files' }, { status: 500 });
    }
}

