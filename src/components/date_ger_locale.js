export default function date_ger_locale(datestr, full = true) {
    const monthnames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    try {
        const month = datestr.split(".")[1]
        const day = datestr.split(".")[2].split("T")[0]
        const time = datestr.split(".")[2].split("T")[1]
        const monthword = monthnames[parseInt(month) - 1]
        return full ? `${day}. ${monthword} ${time}` : `${day}. ${monthword}`
    } catch (e) {
        return ""
    }
}