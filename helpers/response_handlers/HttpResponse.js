class HttpResposne {
	SuccessResult(result, newToken) {
		return {
			response: {
				result,
				token: newToken ? newToken : ''
			},
			errorMessage: ''
		}
	}

	ErrorResult(errorMessage, newToken) {
		return {
			response: {
				result: null,
				token: newToken ? newToken : ''
			},
			errorMessage
		}
	}
}

module.exports = HttpResposne
