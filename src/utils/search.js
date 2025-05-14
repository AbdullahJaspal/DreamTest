function findUsers(users, searchPrompt) {
  searchPrompt = searchPrompt?.toLowerCase();
  let matchingUsers = [];
  for (let user of users) {
    if (
      user?.nickname?.toLowerCase()?.includes(searchPrompt) ||
      user?.username?.toLowerCase()?.includes(searchPrompt)
    ) {
      matchingUsers.push(user);
    }
  }
  return matchingUsers.length > 0 ? matchingUsers : null;
}

export {findUsers};
