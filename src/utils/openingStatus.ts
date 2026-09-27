export interface OperatingStatus {
  isOpen: boolean;
  headline: string;
  subtext: string;
  nextTimeNotice: string;
}

export function getOperatingStatus(): OperatingStatus {
  // Compute Sri Lanka Time (UTC + 5 hours 30 mins)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const slOffset = 5.5 * 60 * 60000;
  const slTime = new Date(utc + slOffset);

  const dayOfWeek = slTime.getDay(); // 0 is Sunday, 6 is Saturday
  const hours = slTime.getHours();
  const minutes = slTime.getMinutes();
  const currentTimeDec = hours + minutes / 60;

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Weekday: 7:30 (7.5) to 21:00 (21.0)
  // Weekend: 8:00 (8.0) to 22:00 (22.0)
  const openTime = isWeekend ? 8.0 : 7.5;
  const closeTime = isWeekend ? 22.0 : 21.0;

  const openTimeStr = isWeekend ? "8:00 AM" : "7:30 AM";
  const closeTimeStr = isWeekend ? "10:00 PM" : "9:00 PM";

  if (currentTimeDec >= openTime && currentTimeDec < closeTime) {
    return {
      isOpen: true,
      headline: `OPEN NOW · CLOSES AT ${closeTimeStr}`,
      subtext: "Espresso & brew bar active in Kaduwela",
      nextTimeNotice: `Open today until ${closeTimeStr}`,
    };
  } else {
    const nextOpen = currentTimeDec < openTime ? `today at ${openTimeStr}` : `tomorrow at ${openTimeStr}`;
    return {
      isOpen: false,
      headline: `CLOSED NOW · OPENS ${nextOpen.toUpperCase()}`,
      subtext: "Plan your visit · Walk-ins welcomed",
      nextTimeNotice: `Opens ${nextOpen}`,
    };
  }
}
