import * as fs from "fs"

function readFilesFromDirectoryAndCreateIndex(directory: string) {
    fs.readdir(directory, (err, files: string[]) => {
        console.log(`Reading files in: ${directory}`);
        if (files) {
            let importStatements: string = "";
            let exportStatements: string[] = [];
            files.map(f => {
                if (f.endsWith(".css")) {
                    importStatements = importStatements.concat(`import * as ${f.split(".")[0]} from "./${f}"; \n`);
                    exportStatements.push(f.split(".")[0]);
                }
                // Directories: Recursive loop - sub directories
                if (f.indexOf(".") === -1) {
                    importStatements = importStatements.concat(`import * as ${f} from "./${f}/";\n`);
                    exportStatements.push(f);
                    readFilesFromDirectoryAndCreateIndex(`${directory}\\${f}`);
                }
            })
            let exportStatementsOutput: string = "export {";
            exportStatements.map((e, i) => {
                if (i !== exportStatements.length - 1) {
                    exportStatementsOutput = exportStatementsOutput.concat(`${e}, `)
                } else {
                    exportStatementsOutput = exportStatementsOutput.concat(`${e}`)
                }
            });
            exportStatementsOutput = exportStatementsOutput.concat("};");
            const output = importStatements.concat(`\n`).concat(exportStatementsOutput);
            fs.writeFile(`${directory}\\index.ts`, output, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Index file saved in: ${directory}`)
                }
            } )
        } 
        else {
            console.log(`No files in: ${directory}`) 
        }
    })
}

readFilesFromDirectoryAndCreateIndex(__dirname);
