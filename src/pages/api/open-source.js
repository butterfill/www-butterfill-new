import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

export const prerender = false;

const execPromise = promisify(exec);

export async function POST({ request }) {
  // Only allow this in development mode
  if (import.meta.env.PROD) {
    return new Response(
      JSON.stringify({ error: 'This endpoint is only available in development mode' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Get the body text directly
  
  const bodyText = await request.text();
  
  // Check if body is empty
  if (!bodyText) {
    return new Response(
      JSON.stringify({ error: 'Request body is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  let json;
  try {
    json = JSON.parse(bodyText);
  } catch (parseError) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { filePath } = json;
  
  if (!filePath) {
    return new Response(
      JSON.stringify({ error: 'File path is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Construct the full file path
    // For writing: src/content/writing/filename.md
    // For talks: src/content/talks/filename.md
    // For teaching: src/content/teaching/filename.md
    const fullPath = path.join(process.cwd(), 'src', 'content', filePath);
    
    // Execute the VS Code command
    const { stdout, stderr } = await execPromise(`code "${fullPath}"`);
    
    if (stderr) {
      console.error('Error opening file in VS Code:', stderr);
      return new Response(
        JSON.stringify({ error: 'Failed to open file in VS Code', details: stderr }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'File opened in VS Code' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in open-source API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}