import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ngrokPath = '/home/susu3100/kndb/node_modules/ngrok'; 
function startNgrok() {
    const args = [
        'http',
        '--domain=poetic-lobster-stable.ngrok-free.app',
        '4030',
        '--log=ngrok.log'
    ];

    const ngrok = spawn(ngrokPath, args);

    ngrok.stdout.on('data', (data) => {
        console.log(`stdout: ${data.toString()}`);
    });

    ngrok.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
    });

    ngrok.on('close', (code) => {
        console.log(`ngrok process exited with code ${code}`);
        console.log('Restarting ngrok...');
        startNgrok(); 
    });
}

startNgrok(); 
