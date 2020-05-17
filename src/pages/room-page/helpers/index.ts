export const getRoomName = (ownerName: string) => {
  const endsWithS = ownerName[ownerName.length - 1] === "s";
  if (endsWithS) {
    return `${ownerName}' Room`;
  }
  return `${ownerName}'s Room`;
};
