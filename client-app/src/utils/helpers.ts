import { TUser, TUserSettings } from '@/controllers/UserController';

export function isINN(value: string): boolean {
  if (!(/^\d{10}$/.test(value)) && !(/^\d{12}$/.test(value))) {
    return false;
  }
  const valueArr = value.split('') as unknown as number[];
  // для ИНН в 10 знаков
  if (
    (valueArr.length === 10) &&
    (+valueArr[9] === (
      (
        2 * valueArr[0] + 4 * valueArr[1] + 10 * valueArr[2] + 3 * valueArr[3] + 5 * valueArr[4] +
        9 * valueArr[5] + 4 * valueArr[6] + 6 * valueArr[7] + 8 * valueArr[8]
      ) % 11
    ) % 10
    )) {
    return true;
  }
  // для ИНН в 12 знаков
  return (valueArr.length === 12) && (
    (+valueArr[10] === (
      (
        7 * valueArr[0] + 2 * valueArr[1] + 4 * valueArr[2] + 10 * valueArr[3] + 3 * valueArr[4] + 5 * valueArr[5] +
        9 * valueArr[6] + 4 * valueArr[7] + 6 * valueArr[8] + 8 * valueArr[9]
      ) % 11) % 10) &&
    (+valueArr[11] === (
      (
        3 * valueArr[0] + 7 * valueArr[1] + 2 * valueArr[2] + 4 * valueArr[3] + 10 * valueArr[4] + 3 * valueArr[5] +
        5 * valueArr[6] + 9 * valueArr[7] + 4 * valueArr[8] + 6 * valueArr[9] + 8 * valueArr[10]
      ) % 11) % 10)
  );
}

export function isOGRN(value: string): boolean {
  if (!(/^\d{13}$/.test(value))) {
    return false;
  }
  return parseInt((value.slice(0, -1) as unknown as number % 11).toString().slice(-1)) === +value[12];
}

export function isOGRNIP(value: string): boolean {
  if (!(/^\d{15}$/.test(value))) {
    return false;
  }
  return parseInt((value.slice(0, -1) as unknown as number % 13).toString().slice(-1)) === +value[14];
}

export function capitalize(value: string): string {
  const cleanValue = value?.trim();

  return cleanValue && cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
}

export function uuid(): string {
  return (~~(Math.random() * 1e8)).toString(16) + '-' +
    (~~(Math.random() * 1e8)).toString(16) + '-' +
    (~~(Math.random() * 1e8)).toString(16);
}

export function checkObjNil(obj: any): any {
  if (obj) {
    return !obj?.nil
      ? obj
      : null;
  }
  return null;
}

export function checkArrkeysObj(obj: any, keys: Array<string>, index = 0): any {
  if (obj === null || obj === undefined) { return null; }

  if (keys.length > index + 1 && checkObjNil(obj[keys[index]]) !== null) {
    return checkArrkeysObj(obj[keys[index]], keys, index + 1);
  } else {
    return checkObjNil(obj[keys[index]]);
  }
}

export function checkArrObjkeys(obj: Array<any>): boolean {
  return obj.some(item => {
    const itemChecked = checkObjNil(item) || {};
    return Object.keys(itemChecked).length > 0;
  });
}

export function getNoun(number: number, one: string, two: string, five: string) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}

export function isPassword(
  password: string,
  minLength = 10,
  requiresLower = true,
  requiresUpper = false,
  requiresNumbers = true,
  requiresSymbols = false): { success: boolean, msgs: string[] } {
  const msgs = [];
  password = password ?? '';
  const passwordArray = [...password];
  if (password.length < minLength) {
    msgs.push(`Пароль должен содержать не менее ${minLength} символов.`);
  }

  if (requiresLower && !hasLower(password)) {
    msgs.push('Пароль должен содержать строчные символы.');
  }

  if (requiresUpper && !hasUpper(password)) {
    msgs.push('Пароль должен содержать заглавные символы.');
  }

  if (requiresNumbers && !/[0-9]/.test(password)) {
    msgs.push('Пароль должен содержать цифры.');
  }

  if (requiresSymbols && !passwordArray.some(c => c.toLowerCase() === c.toUpperCase())) {
    msgs.push('Пароль должен содержать буквенные символы.');
  }

  return { success: msgs.length === 0, msgs };
}

function hasLower(s: string) {
  const sArray = [...s];
  // смотрим буквы
  return sArray
    .filter(c => c.toLowerCase() !== c.toUpperCase())
    .some(c => c.toLowerCase() === c);
}

function hasUpper(s: string) {
  const sArray = [...s];
  // смотрим буквы
  return sArray
    .filter(c => c.toLowerCase() !== c.toUpperCase())
    .some(c => c.toUpperCase() === c);
}

export function generatePassword(userSettings: TUserSettings): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  const all = uppercase + lowercase + numbers + symbols;

  let password = '';
  for (let i = 0; i < userSettings.passwordMinimumLength; i++) {
    const randomIndex = secureRandomInt(all.length);
    password += all[randomIndex];
  }

  if (userSettings.passwordIsLowercases && [...password].every(c => !lowercase.includes(c))) {
    return generatePassword(userSettings);
  }
  if (userSettings.passwordIsUpperCases && [...password].every(c => !uppercase.includes(c))) {
    return generatePassword(userSettings);
  }
  if (userSettings.passwordIsNumbers && [...password].every(c => !numbers.includes(c))) {
    return generatePassword(userSettings);
  }
  if (userSettings.passwordIsSymbols && [...password].every(c => !symbols.includes(c))) {
    return generatePassword(userSettings);
  }

  return password;

  function secureRandomInt(max: number) {
    let num = 0;
    const min = 2 ** 32 % max; // for eliminating bias
    const rand = new Uint32Array(1);

    do {
      num = crypto.getRandomValues(rand)[0];
    } while (num < min);

    return num % max;
  }
}
