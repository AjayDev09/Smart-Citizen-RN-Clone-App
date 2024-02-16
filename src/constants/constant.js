import { Alert, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { COLORS } from "../theme";
import RNFS, { copyFile, } from 'react-native-fs'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Share from "react-native-share";

const maritalData = [
  { label: 'Single', label_ar: 'غير مرتبطة', label_he: 'יחיד', label_fr: 'Célibataire', label_ru: 'Одинокий', value: 'Single' },
  { label: 'Married', label_ar: 'متزوج', label_he: 'נָשׂוּי', label_fr: 'Marié', label_ru: 'Женатый', value: 'Married' },
  { label: 'Widowed', label_ar: 'الأرامل', label_he: 'אלמנה', label_fr: 'Veuf', label_ru: 'Вдовец', value: 'Widowed' },
  { label: 'Separated', label_ar: 'منفصل', label_he: 'מופרד', label_fr: 'Séparé', label_ru: 'Отдельный', value: 'Separated' },
  { label: 'Divorced', label_ar: 'مُطلّق', label_he: 'גרושה', label_fr: 'Divorcé', label_ru: 'В разводе', value: 'Divorced' },
];
const GenderData = [
  { label: 'Male', label_ar: 'ذكر', label_he: 'זָכָר', label_fr: 'Mâle', label_ru: 'Мужской', value: 'Male' },
  { label: 'Female', label_ar: 'أنثى', label_he: 'נְקֵבָה', label_fr: 'Femelle', label_ru: 'Женский', value: 'Female' },
  { label: 'Other', label_ar: 'آخر', label_he: 'אַחֵר', label_fr: 'Autre', label_ru: 'Другой', value: 'Other' },
];

const ChildrenData = [
  { label: ' 0', label_ar: ' 0', label_he: ' 0', label_fr: '0', label_ru: '0', value: '0' },
  { label: ' 1', label_ar: ' 1', label_he: ' 1', label_fr: '1', label_ru: '1', value: '1' },
  { label: ' 2', label_ar: ' 2', label_he: ' 2', label_fr: '2', label_ru: '2', value: '2' },
  { label: ' 3', label_ar: ' 3', label_he: ' 3', label_fr: '3', label_ru: '3', value: '3' },
  { label: ' 4', label_ar: ' 4', label_he: ' 4', label_fr: '4', label_ru: '4', value: '4' },
  { label: ' 5', label_ar: ' 5', label_he: ' 5', label_fr: '5', label_ru: '5', value: '5' },
];
const EducationData = [
  { label: 'Primary Education', label_ar: 'تعليم ابتدائي', label_he: 'חינוך יסודי', label_fr: 'Enseignement primaire', label_ru: 'Начальное образование', value: 'Primary', },
  { label: 'Secondary Education', label_ar: 'التعليم الثانوي', label_he: 'חינוך תיכוני', label_fr: 'Éducation secondaire', label_ru: 'Среднее образование', value: 'Secondary', },
  { label: 'Bachelor\'s Degree', label_ar: 'درجة البكالريوس', label_he: 'תואר ראשון', label_fr: 'Licence', label_ru: 'Степень бакалавра', value: 'Bachelor', },
  { label: 'Master\'s Degree', label_ar: 'ماجيستير', label_he: 'תואר שני', label_fr: 'Une maîtrise', label_ru: 'Степень магистра', value: 'Master', },
  { label: 'Doctorate or higher', label_ar: 'درجة الدكتوراه أو أعلى', label_he: 'דוקטורט ומעלה', label_fr: 'Doctorat ou supérieur', label_ru: 'Докторантура или выше', value: 'Doctorate', },
  { label: 'Talmid Haham', label_ar: 'طالب ذكي', label_he: 'תלמיד חכם', label_fr: 'Talmid Haham', label_ru: 'Талмид Хахам', value: 'TalmidHaham', },
];


const AMPM = [
  { label: 'AM', label_ar: 'AM', label_he: 'AM', label_fr: 'AM', label_ru: 'AM', value: 'AM' },
  { label: 'PM', label_ar: 'PM', label_he: 'PM', label_fr: 'PM', label_ru: 'PM', value: 'PM' },
];
const businessActivity = [
  { label: 'Construction', label_ar: 'بناء', label_he: 'בְּנִיָה', label_fr: 'Construction', label_ru: 'Строительство', value: 'Construction' },
  { label: 'Education', label_ar: 'تعليم', label_he: 'חינוך', label_fr: 'Éducation', label_ru: 'Образование', value: 'Education' },
  { label: 'Financial and insurance Service', label_ar: 'خدمة المالية والتأمين', label_he: 'שירות פיננסי וביטוח', label_fr: 'Service financier et d\'assurance', label_ru: 'Финансово-страховая служба', value: 'FinancialInsurance' },
  { label: 'Accommodation and Food', label_ar: 'الإقامة والطعام', label_he: 'לינה ואוכל', label_fr: 'Hébergement et nourriture', label_ru: 'Проживание и питание', value: 'Accommodation' },
  { label: 'Hospital and Medical Care', label_ar: 'المستشفى والرعاية الطبية', label_he: 'בית חולים וטיפול רפואי', label_fr: 'Hôpital et soins médicaux', label_ru: 'Больница и медицинское обслуживание', value: 'MedicalCare' },
  { label: 'Trade', label_ar: 'تجارة', label_he: 'סַחַר', label_fr: 'Commerce', label_ru: 'Торговля', value: 'Trade' },
];
const businessSector = [
  { label: 'Construction', label_ar: 'بناء', label_he: 'בְּנִיָה', label_fr: 'Construction', label_ru: 'Строительство', value: 'Construction' },
  { label: 'Education', label_ar: 'تعليم', label_he: 'חינוך', label_fr: 'Éducation', label_ru: 'Образование', value: 'Education' },
  { label: 'Chemical industries', label_ar: 'الصناعات الكيماوية', label_he: 'תעשיות כימיות', label_fr: 'Industries chimiques', label_ru: 'Химическая промышленность', value: 'Chemical' },
  { label: 'Commerce', label_ar: 'تجارة', label_he: 'מִסְחָר', label_fr: 'Commerce', label_ru: 'Коммерция', value: 'Commerce' },
  { label: 'Health Service', label_ar: 'خدمة صحية', label_he: 'שירות בריאות', label_fr: 'Services de santé', label_ru: 'Медицинское обслуживание', value: 'Health' },
];

export const REVIEW_LABEL = [
  { label: 'Terrible', label_ar: 'فظيع', label_he: 'מַחרִיד', label_fr: 'Terrible', label_ru: 'Ужасный', value: 1 },
  { label: 'Bad', label_ar: 'سيء', label_he: 'רַע', label_fr: 'Mauvais', label_ru: 'Плохой', value: 2 },
  { label: 'Okay', label_ar: 'تمام', label_he: 'בסדר', label_fr: 'D\'accord', label_ru: 'Хорошо', value: 3 },
  { label: 'Good', label_ar: 'جيد', label_he: 'טוֹב', label_fr: 'Bien', label_ru: 'Хороший', value: 4 },
  { label: 'Great', label_ar: 'عظيم', label_he: 'גדול', label_fr: 'Super', label_ru: 'Большой', value: 5 },
]


export const REPORT_DATA_en = [
  "I just don't like it",
  "It's spam",
  "Nudity or sexual activity",
  "Hate speech or symbols",
  "Violence or dangerous organisations",
  "Bullying or harassment",
  "False information",
  "Scam or fraud",
  "Suicide or self-injury",
  "Sale of illegal or regulated goods",
  "Intellectual property violation",
  "Eating disorders",
  "Something else",
]

export const REPORT_DATA_he = [
  "אני פשוט לא אוהב את זה",
  "זה ספאם",
  "עירום או פעילות מינית",
  "דברי שנאה או סמלים",
  "אלימות או ארגונים מסוכנים",
  "בריונות או הטרדה",
  "מידע שגוי",
  "הונאה או הונאה",
  "התאבדות או פציעה עצמית",
  "מכירה של סחורות לא חוקיות או בפיקוח",
  "הפרת קניין רוחני",
  "הפרעות אכילה",
  "משהו אחר"
]
export const REPORT_DATA_ar = [
  "أنا فقط لا أحب ذلك",
  "أنها رسائل مزعجه",
  "العري أو النشاط الجنسي",
  "خطاب الكراهية أو الرموز",
  "العنف أو المنظمات الخطرة",
  "التنمر أو التحرش",
  "معلومات خاطئة",
  "احتيال أو احتيال",
  "الانتحار أو إيذاء النفس",
  "بيع البضائع غير القانونية أو المنظمة",
  "انتهاك الملكية الفكرية",
  "اضطرابات الاكل",
  "شيء آخر"
]
export const REPORT_DATA_fr = [
  "Je n'aime tout simplement pas ça",
  "C'est un spam",
  "Nudité ou activité sexuelle",
  "Discours ou symboles de haine",
  "Violence ou organisations dangereuses",
  "Intimidation ou harcèlement",
  "Fausse information",
  "Arnaque ou fraude",
  "Suicide ou automutilation",
  "Vente de marchandises illégales ou réglementées",
  "Violation de la propriété intellectuelle",
  "Troubles de l'alimentation",
  "Autre chose"
]
export const REPORT_DATA_ru = [
  "мне это просто не нравится",
  "Это спам",
  "Нагота или сексуальная активность",
  "Разжигание ненависти или символы",
  "Насилие или опасные организации",
  "Запугивание или преследование",
  "Ложная информация",
  "Мошенничество или мошенничество",
  "Самоубийство или членовредительство",
  "Продажа нелегальных или подконтрольных товаров",
  "Нарушение интеллектуальной собственности",
  "Расстройства пищевого поведения",
  "Что-то другое"
]

const fontMargin = 1

export const htmlStylesheet = StyleSheet.create({
  h1: {
    fontSize: RFValue(18),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  h2: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  h3: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  h4: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  p: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  ul: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  ol: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  li: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  strong: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
  pre: {
    fontSize: RFValue(14),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    textAlign: 'left',
    marginBottom: hp(fontMargin)
  },
});

async function GetAllPermissions() {
  try {
    if (Platform.OS === "android") {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE
      ]);
      return userResponse;
    }
  } catch (err) {
    Warning(err);
  }
  return null;
}

export async function requestMultiplePermissions(permissions) {

  if (Platform.OS === 'android') {
    try {
      const grants = await PermissionsAndroid.requestMultiple(permissions);
      console.log('write external stroage', grants);
      if (
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('permissions granted', grants);
        return true
      } else {
        console.log('All required permissions not granted');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true
  }
}





const createFileUriFromContentUri = async (contentUri) => {
  const fileUri = contentUri
    .replace(
      'com.android.providers.media.documents/document/video%3A',
      'media/external/video/media/',
    );
  const uriComponents = fileUri.split('/');
  const fileName = uriComponents[uriComponents.length - 1];
  const newFilePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
  await copyFile(contentUri, newFilePath);

  decodeURIComponent

  return `file://${newFilePath}`;
}

const getDeepLinkUrl = async (url, lastPath) => {
  //blog-detail
  //torah-collection-detail/566
  //coupons-detail/100
  var mapObj = {
    PublicFeed: "torah-collection-detail",
    Blog: "blog-detail",
    coupons: "coupons-detail",
    SocialUserProfile: 'social/social-profile',
  };
  lastPath = lastPath.replace(/PublicFeed|Blog|coupons|SocialUserProfile/gi, function (matched) {
    return mapObj[matched];
  });

  const weburl = `https://toshavhaham.co.il/${lastPath}` //
  console.log('lastPath', weburl)
  const link = await dynamicLinks().buildShortLink({
    link: url,
    domainUriPrefix: 'https://toshavhahamapp.page.link',
    //domainUriPrefix: 'https://toshavhaham.co.il',
    android: {
      packageName: 'com.toshavhaham',
      fallbackUrl: 'https://play.google.com/store/apps/details?id=com.toshavhaham', // Replace with your Android app's URL
    },
    ios: {
      bundleId: 'com.smartcitizen',
      appStoreId: '1658696488',
      fallbackUrl: 'https://apps.apple.com/app/1658696488', // Replace with your iOS app's URL
    },
    otherPlatform: {
      fallbackUrl: weburl,
    },
    navigation: {
      forcedRedirectEnabled: true
    },

  }, dynamicLinks.ShortLinkType.UNGUESSABLE);

  //console.log('link', link)

  return link
}



const onShare = async (title, lastPath) => {
  const url = `https://toshavhaham/${lastPath}`
  //  const url = `http://toshavhaham.co.il/${lastPath}`
  const link = await getDeepLinkUrl(url, lastPath)
  console.log('getDeepLinkUrl link', link)

  const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAA1hJREFUOE9tkl9sU3UUx7/nd29X2ss22NZ267Zgx7Zu3YCt44+DZQsJGpeYYIbRgM4hC5pBCFEgmhDhwRcNPpho1ERIBIUIYjZlIJgYJzh1TCjZP9paVvnXrn/GupZ2vb2995reN3Xn4Tyck/PJ+Z7zpVWdJ/9w1CxvnPDOAUQqAQBBBaBCVSUVlNVKpKpQtZTrSXZboeK7O5+m5/f2T66uK3FcufYQLY1mLIgyhm8EczP/C6vZiLa1Vpz/wYfu52owcmtmgV45cMHtbDTZv77ox5u7mpFMSTh23LUo4KlNlTjQ60Rn7wB2bavFuHs2Rjve+N69sbnUfuIbL+qrl2PdKgs+Pze1KMDZUILmehNOnJ/Cvm4Hbk3NztGeI1fc7etL7ceOTyCbVfDx0Q68/s7QooC3djsx8NMdeKZjOLrPiV9GHs5Rz8FBT/uGstovvvVhNiaib3sD7gYTuDR071+Qqop87H+1CfvfvQZ9HsOel+owOhaO0ra9A57WJnPtmUE/0qIMHU/44O02jI6H0P/jHYgZBe3rrOjpqseh939FeDYNxoDurSsxOhYJ02uHL3s3rDHVfHLarX0gFxwjdD1dhc1PVoDXMbgmI/jqOw8SSUnr8xzhYG8jRsejYdp56KJvo9Oy8mS/D3PxzKLa/1sUDBx2v2jH7zdnQrT55bPTW1qtttMX/MjTMZSZDLgXTEIzFABFUcEY5cylWUizEYDtz9ow/OdMkBo6T/3d2mRa4br9CAtpGTu7amEpMUDHM3j98xAMOuj1BOMSHWYiKfzmCiEQSmFTixlXrwcD1PbClw9kBeU8I6QlGUY9r91AlGQQEaSsgqJCPYwGnQbMLbBEz0GSVKiKEqCzg5PzHMcVVJblI/44A1ORAWOeKLZuqcbkXxHMJ0TYKgqRFrOanBxwWb4eN6dCWGFdGqMjH15NLCswLu3bsRofnXIhJ3ftmlJIkoKO9ZV477PrcFQXY2jkPmyVhVBkFc90PIHBn/0IR+KPqO/w5cfEcUJPlwPnLnlRZhbQ1lKOeDIDS7ERn54Z0955YyIEnmOoqypCuUXA7ekY7gdiUXoQiA6rKgnEiPE8MSKQXseTLKuUySpIJTNMEPJYPCGSqdjARElhC+ksFQh5LBZPxf4B/fdgLNIvfAAAAAAASUVORK5CYII='

  const options = {
    title: title,
    message: title + " \n" + link,
    activityItemSources: [
      {
        placeholderItem: {
          type: 'url',
          content: icon
        },
        item: {
          default: {
            type: 'text',
            //content: `${title} ${link}`
          },
        },
        linkMetadata: {
          title: title,
          icon: icon
        }
      }
    ],
  }

  const options1 = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing url with custom title.
          placeholderItem: { type: 'url', content: url },
          item: {
            default: { type: 'url', content: url },
          },
          subject: {
            default: title,
          },
          linkMetadata: { originalUrl: url, url, title },
        },
        {
          // For sharing text.
          placeholderItem: { type: 'text', content: title },
          item: {
            default: { type: 'text', content: title },
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: title,
          },
        },
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: icon,
          },
          item: {
            default: {
              type: 'text',
              content: `${title} ${url}`,
            },
          },
          linkMetadata: {
            title: title,
            icon: icon,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${title} ${url}`,

    },
  });


  try {
    const result = await Share.open(options);
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    // Alert.alert(error.message);
  }
};





export {
  maritalData, ChildrenData,GenderData,
  EducationData, AMPM, businessActivity,
  businessSector, createFileUriFromContentUri,
  onShare,
  getDeepLinkUrl,
};