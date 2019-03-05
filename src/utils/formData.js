const formDate = (dateUnix) => {
  const dateTime = new Date(Number(dateUnix));
  const date = dateTime.toLocaleDateString('en-GB');
  const time = dateTime.toLocaleTimeString('en-GB');
  
  return date.concat(' ', time);
};

const formCardNumber = (cardNumber) => {
 return cardNumber.replace(/([\d]{2})(\d+)([\d]{4})/, (all, begin, middle, end) => {
    return begin.concat(('*').repeat(middle.length), end);
    });
};

const formUserFullName = (firstName, lastName, gender) => {
  const fullName = firstName.concat(' ', lastName);

  return gender === 'Male' ? 'Mr.'.concat(' ', fullName): 'Ms.'.concat(' ', fullName);
};

const formUserBirthday = (birthday) => {
  return new Date(Number(birthday)).toLocaleDateString('en-GB');
};

export { formDate, formCardNumber, formUserFullName, formUserBirthday };