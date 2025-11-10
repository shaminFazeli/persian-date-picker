let yearOptions = "";
let monthOptions = "";
const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    parseInt((gy2 + 3) / 4) -
    parseInt((gy2 + 99) / 100) +
    parseInt((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * parseInt(days / 12053);
  days %= 12053;
  jy += 4 * parseInt(days / 1461);
  days %= 1461;
  jy += parseInt((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  let jm =
    days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
  let jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  return { year: jy, month: jm, day: jd };
}
function getTodayJalali() {
  const today = new Date();
  const jalali = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  return jalali;
}
function getJalaliMonthDays(year, month) {
  // ماه‌های 31 روزه: 1,2,3,4,5,6
  // ماه‌های 30 روزه: 7,8,9,10,11
  // ماه 12 (اسفند): 29 روز (در سال کبیسه 30 روز)

  if (month >= 1 && month <= 6) {
    return 31;
  } else if (month >= 7 && month <= 11) {
    return 30;
  } else {
    // ماه 12 - اسفند
    // محاسبه کبیسه بودن سال شمسی
    const isLeap = (year - 1) % 4 === 0;
    return isLeap ? 30 : 29;
  }
}

const today = getTodayJalali();
let initialYear = today.year;
let initialMonth = today.month;
let initialDay = today.day;

for (let year = 1200; year <= 1600; year++) {
  let selected = initialYear == year ? "selected" : "";
  yearOptions += `<option value="${year}" ${selected}>${year}</option>`;
}

for (let i = 0; i < months.length; i++) {
  let selected = initialMonth - 1 == i ? "selected" : "";
  monthOptions += `<option value="${i}" ${selected}>${months[i]}</option>`;
}

// توابع gregorianToJalali و getTodayJalali و getJalaliMonthDays همونجا بمونن...

// تابع رندر کردن روزهای ماه
function renderDays(year, month, $container, $targetInput) {
  const daysInMonth = getJalaliMonthDays(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();

  let daysHTML = '<div class="calendar-grid">';

  // نمایش نام روزهای هفته
  const weekdays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  weekdays.forEach((day) => {
    daysHTML += `<div class="weekday">${day}</div>`;
  });

  // خانه‌های خالی قبل از شروع ماه
  for (let i = 0; i < firstDay; i++) {
    daysHTML += '<div class="day empty"></div>';
  }

  // روزهای ماه
  for (let day = 1; day <= daysInMonth; day++) {
    daysHTML += `<div class="day ${
      initialDay == day ? "selected" : ""
    }" data-day="${day}">${day}</div>`;
  }

  daysHTML += "</div>";

  // بعد از اضافه کردن به DOM
  setTimeout(() => {
    $container.find(".day:not(.empty)").on("click", function () {
      const clickedDay = $(this).data("day");
      const selectedYear = parseInt($container.find(".year-select").val());
      const selectedMonth =
        parseInt($container.find(".month-select").val()) + 1;

      const formattedDate = `${selectedYear}/${selectedMonth
        .toString()
        .padStart(2, "0")}/${clickedDay.toString().padStart(2, "0")}`;

      $targetInput.val(formattedDate);
      $container.hide();
    });
  }, 0);

  return daysHTML;
}

// تابع آپدیت روزها
function updateCalendarDays($container, $targetInput) {
  const selectedYear = parseInt($container.find(".year-select").val());
  const selectedMonth = parseInt($container.find(".month-select").val()) + 1;
  $container
    .find(".calendar-body")
    .html(renderDays(selectedYear, selectedMonth, $container, $targetInput));
}

$('[data-role="datepicker"]').on("click", function (e) {
  $('[data-role="datepicker-container"]').remove();

  const $targetInput = $(this);
  const inputValue = $(this).val();

  if (inputValue) {
    const parts = inputValue.split("/");
    initialYear = parseInt(parts[0]);
    initialMonth = parseInt(parts[1]);
    initialDay = parseInt(parts[2]);
  }

  // ساخت options جدید برای هر اینپوت
  let yearOptions = "";
  let monthOptions = "";

  for (let year = 1200; year <= 1600; year++) {
    let selected = initialYear == year ? "selected" : "";
    yearOptions += `<option value="${year}" ${selected}>${year}</option>`;
  }

  for (let i = 0; i < months.length; i++) {
    let selected = initialMonth - 1 == i ? "selected" : "";
    monthOptions += `<option value="${i}" ${selected}>${months[i]}</option>`;
  }

  const $container = $(`
    <div data-role="datepicker-container" class="datepicker-container">
        <div class="calendar-header">
            <select class="year-select">${yearOptions}</select>
            <select class="month-select">${monthOptions}</select>
        </div>
        <div class="calendar-body">
        </div>
    </div>
  `);
  $container
    .find(".calendar-body")
    .html(renderDays(initialYear, initialMonth, $container, $targetInput));
  // event برای تغییر سال و ماه
  $container.find(".year-select, .month-select").on("change", function () {
    updateCalendarDays($container, $targetInput);
  });

  $("body").append($container);

  const inputPosition = $(this).offset();
  const inputWidth = $(this).outerWidth();
  $container.css({
    position: "absolute",
    right: inputPosition.right + "px",
    width: inputWidth + "px",
    maxWidth: "250px",
    minWidth: "200px",
    top: inputPosition.top + $(this).outerHeight() + "px",
    height: "270px",
    overflowY: "auto",
  });

  $container.show();
  e.stopPropagation();

  $container.on("click", function (e) {
    e.stopPropagation();
  });
});

$(document).on("click", function () {
  $('[data-role="datepicker-container"]').hide();
});

$('[data-role="datepicker-container"]').on("click", function (e) {
  e.stopPropagation();
});

$(document).on("click", function () {
  $('[data-role="datepicker-container"]').hide();
});
