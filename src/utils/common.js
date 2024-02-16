import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import Toast from 'react-native-simple-toast';

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const urlPatternValidation = URL => {
  const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
  return regex.test(URL);
};

export function drawImageScaled(imgWidth, imgHeight) {
  let screenSize = Dimensions.get('window');
  let hRatio = (screenSize.width - 40) / imgWidth;
  let vRatio = (screenSize.height) / imgHeight;
  let ratio = Math.min(hRatio, vRatio);
  return { width: parseInt(imgWidth * ratio), height: parseInt(imgHeight * ratio) };
}


export const ShowErrorToast = (error) => {
  if (error && error.data)
    Toast.show(error.data && error.data.message, Toast.SHORT);
}
export const ShowToast = (message) => {
  if (message)
    Toast.show(message && message, Toast.SHORT);
}
export const IsRightOrLeft = (language) => {
  return language === 'he' || language === 'ar' ? 'right' : 'left'
}
 

export const DATE_ = "YYYY-MM-DD"
export const DATE_FORMATE_24 = "DD-MM-YYYY hh:mm A"
export const DATE_FORMATE_12 = "DD-MM-YYYY HH:mm"
export const DATE_FORMATE_12_SORT = "DD-MM-YY HH:mm"

export const getLabelField = (language) => {
  return language === 'he' ? "label_he" :
    language === 'ar' ? 'label_ar' :
      language === 'fr' ? 'label_fr' :
        language === 'ru' ? 'label_ru' : "label"
}
export const getItemByLngAR = (language, object, key) => {
  return  language === 'en' ? `${object[`${key}`]}`: `${object[`${key}_${language}`]}`
}

export const isImageByType = type =>  type == 'image/jpeg' ||
type == 'image/png' ||
type == 'image/jpg' ||
type == 'image/webp' ||
type == 'image/gif'


export const isVideoByType = type =>  type == 'video/mp4' ||
type == 'video/quicktime' ||
type == 'video/mov' ||
type == 'video/MOV'

export const isImage = (url) => {
  return url && url?.toString().endsWith("jpeg")
    || url?.toString()?.endsWith("JPEG")
    || url?.toString()?.endsWith("jpg")
    || url?.toString()?.endsWith("JPG")
    || url?.toString()?.endsWith("png")
    || url?.toString()?.endsWith("PNG")
    || url?.toString()?.endsWith("gif")
    || url?.toString()?.endsWith("GIF")
}

export const isAudio = (url) => {
  return url &&
    url?.toString()?.endsWith("mp3")
    || url?.toString()?.endsWith("MP3")
    || url?.toString()?.endsWith("m4a")
    || url?.toString()?.endsWith("M4A")
}
export const isVideo = (url) => {
  return url &&
    url?.toString()?.endsWith("mp4") ||
    url?.toString()?.endsWith("MP4") ||
    url?.toString()?.endsWith("mov") ||
    url?.toString()?.endsWith("MOV") ||
    url?.toString()?.endsWith("flac") ||
    url?.toString()?.endsWith("FLAC")
}
export const isPDF = (url) => {
  return url && url?.toString()?.endsWith("pdf") || url?.toString()?.endsWith("PDF")
}
export const isDocument = (url) => {
  return url &&
    url?.toString()?.endsWith("doc") ||
    url?.toString()?.endsWith("DOC") ||
    url?.toString()?.endsWith("docx") ||
    url?.toString()?.endsWith("DOCX") ||
    url?.toString()?.endsWith("xlsx") ||
    url?.toString()?.endsWith("XLSX") ||
    url?.toString()?.endsWith("xls") ||
    url?.toString()?.endsWith("XLS")
}

export function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export function isDifferentDay(messageIndex) {
  if (messageIndex === 0) return true;

  const d1 = new Date(this.allMessages[messageIndex - 1].timeStamp);
  const d2 = new Date(this.allMessages[messageIndex].timeStamp);

  return (
    d1.getFullYear() !== d2.getFullYear() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getDate() !== d2.getDate()
  );
}

export const getMessageDate = (messageTime) => {
  let dateToday = new Date().toDateString();
  let longDateYesterday = new Date();
  longDateYesterday.setDate(new Date().getDate() - 1);
  let dateYesterday = longDateYesterday.toDateString();
  let today = dateToday.slice(0, dateToday.length - 5);
  let yesterday = dateYesterday.slice(0, dateToday.length - 5);

  const wholeDate = new Date(
    messageTime
  ).toDateString();

  this.messageDateString = wholeDate.slice(0, wholeDate.length - 5);

  if (
    new Date(messageTime).getFullYear() ===
    new Date().getFullYear()
  ) {
    if (this.messageDateString === today) {
      return "Today";
    } else if (this.messageDateString === yesterday) {
      return "Yesterday";
    } else {
      return this.messageDateString;
    }
  } else {
    return wholeDate;
  }
}

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export const fileNameFromUrl = (url) => {
  // this will split the whole url.
  //const f2 = url.split("/");

  // then get the file name with extention.
  //	const fileName = f2[f2.length - 1];
  // const fileExtention = url.split(".")[3];

  const f2 = url.split("/");
  // then get the file name with extention.
  const fileName = f2[f2.length - 1];
  return fileName
}

export const getFileExtension = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ?
    /[^.]+$/.exec(fileUrl) : undefined;
};


export function abbrNum(number, decPlaces) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {

    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round(number * decPlaces / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if ((number == 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
}

export function isEmpty(str) {
  return (!str || str.length === 0);
}