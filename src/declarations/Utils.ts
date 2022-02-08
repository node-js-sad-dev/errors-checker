export class Utils {
    public static formatDate(date: string, format: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss") {
        let d = new Date(date);

        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        let hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();

        switch (format) {
            case "YYYY-MM-DD":
                return `${year}-${month}-${day}`;
            case "YYYY-MM-DD HH:mm:ss":
                return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
        }
    }
}