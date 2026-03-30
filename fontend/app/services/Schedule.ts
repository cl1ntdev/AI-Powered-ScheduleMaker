const ScheduleService = {
  handleExportSchedule: (result: string) => {
    console.log("exporting")
    if (!result) {
      alert("No schedule to export.");
      return;
    }

    const blob = new Blob([result], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.json";
    a.click();
    URL.revokeObjectURL(url);
  },
  handleImportSchedule: () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (event) => {
          const contents = event.target?.result;
          if (contents) {
            try {
              const data = JSON.parse(contents as string);
              resolve(data); 
            } catch (err) {
              reject("Invalid JSON file");
            }
          }
        };
        reader.onerror = () => reject("File reading failed");
        reader.readAsText(file);
      };
    
      input.click();
    });
  
  }
}

export default ScheduleService;