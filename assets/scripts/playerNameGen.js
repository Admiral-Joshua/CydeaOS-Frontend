var CommonNames = ["Specter", "Panther", "Witcher", "Nemo", "Knight", "Cloud", "Griffin", "Onyx", "Parody", "Serpent", "Voyage", "Finch"];

function GenerateRandomName() {
	var IndexNumber = Math.floor(Math.random() * (CommonNames.length - 1));
	return CommonNames[IndexNumber];
}