const { exec } = require('child_process');

const { method, parameters } = JSON.parse(process.argv[2])

if (method === "query") {
    const commands = [
        {
            command: "start",
            description: "Start YASB status bar"
        },
        {
            command: "stop",
            description: "Stop YASB status bar"
        },
        {
            command: "reload",
            description: "Reload YASB status bar"
        }
    ];

    const query = parameters[0].toLowerCase();
    const results = commands
        .filter(c => c.command.includes(query))
        .map(c => {
            return {
                "Title": c.command,
                "Subtitle": c.description,
                "JsonRPCAction": {
                    "method": "execute_yasb_command",
                    "parameters": [c.command]
                },
                "IcoPath": "images\\icon.png"
            }
        });

    console.log(JSON.stringify({ "result": results }));
}

if (method === "execute_yasb_command") {
    const command = parameters[0];
    executeYasbCommand(command);
}

function executeYasbCommand(command) {
    exec(`yasbc ${command}`, (error, stdout, stderr) => {
        if (error) {
            console.log(JSON.stringify({ 
                "result": [{
                    "Title": "Error",
                    "Subtitle": `Error executing yasbc ${command}: ${error.message}`,
                    "IcoPath": "images\\icon.png"
                }]
            }));
            return;
        }
        if (stderr) {
            console.log(JSON.stringify({ 
                "result": [{
                    "Title": "Warning",
                    "Subtitle": `yasbc ${command} stderr: ${stderr}`,
                    "IcoPath": "images\\icon.png"
                }]
            }));
            return;
        }
        console.log(JSON.stringify({ 
            "result": [{
                "Title": "Success",
                "Subtitle": `yasbc ${command} executed successfully`,
                "IcoPath": "images\\icon.png"
            }]
        }));
    });
}