export class Utils {
    public static formatDate(date: string, format: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss") {
        let d = new Date(date);

        let month = '' + (d.getUTCMonth() + 1),
            day = '' + d.getUTCDate(),
            year = d.getUTCFullYear();

        let hours = '' + d.getUTCHours(),
            minutes = '' + d.getUTCMinutes(),
            seconds = '' + d.getUTCSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;

        switch (format) {
            case "YYYY-MM-DD":
                return `${year}-${month}-${day}`;
            case "YYYY-MM-DD HH:mm:ss":
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }
}