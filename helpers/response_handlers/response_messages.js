module.exports = {
	authErrors: {
		Unauthorized: 'Unauthorized user',
		ForbiddenAccess: "You don't have the permission to go to this page"
	},

	paramertersError: {
		queryParamsEmpty: 'please fill query params with specified values',
		pathParamsEmpty: 'please fill path params with specified values',
		bodyEmpty: 'please fill body with specified object',
		someParamerterNotFound: 'Some query/path paramerters not found',
		somePropertiesNotFound: 'Some properties not found in the body',
		collectionMustNotBeEmpty: (collectionName) =>
			`${collectionName} must not be empty`
	},

	successCRUD: {
		insertedItem: (itemName) =>
			`${itemName} -  has been added successfully`,
		updatedItem: (itemName) =>
			`${itemName} -  has been updated successfully`,
		deletedItem: (itemName) =>
			`${itemName} -  has been deleted successfully`,
		gettingItem: (itemName) => `${itemName} - has been got successfully`,

		insertedItems: (itemsName) =>
			`${itemsName} -  have been added successfully`,
		updatedItems: (itemsName) =>
			`${itemsName} -  have been updated successfully`,
		deletedItems: (itemsName) =>
			`${itemsName} -  have been deleted successfully`,
		gettingItems: (itemsName) => `${itemsName} - have been got successfully`
	},

	failedCRUD: {
		insertedItem: (itemName) => `${itemName} -  has not been added`,
		updatedItem: (itemName) => `${itemName} -  has not been updated`,
		deletedItem: (itemName) => `${itemName} -  has not been deleted`,
		gettingItem: (itemName) => `${itemName} - has not been got`,

		insertedItems: (itemsName) => `${itemsName} -  have not been added`,
		updatedItems: (itemsName) => `${itemsName} -  have not been updated`,
		deletedItems: (itemsName) => `${itemsName} -  have not been deleted`,
		gettingItems: (itemsName) => `${itemsName} - have not been got`
	}
}
