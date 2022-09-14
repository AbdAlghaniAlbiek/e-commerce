const cryptoObj = require('crypto')
const Buffer = require('buffer')

class AES {
	constructor({ config }) {
		this.bufferEncryption = config.AES.BUFFER_ENCRYPTION
		this.encryptionType = config.AES.ENCRYPTION_TYPE
		this.encryptionEncoding = config.AES.ENCRYPTION_ENCODING
		this.key = config.AES.KEY
		this.iv = config.AES.IV
	}

	Encryption(plainText) {
		return new Promise((resolve, reject) => {
			try {
				const key = Buffer.from(this.key, this.bufferEncryption)
				const iv = Buffer.from(this.iv, this.bufferEncryption)
				const cipher = cryptoObj.createCipheriv(
					this.encryptionType,
					key,
					iv
				)
				let cipherText = cipher.update(
					plainText,
					this.bufferEncryption,
					this.encryptionEncoding
				)
				cipherText += cipher.final(this.encryptionEncoding)
				resolve(cipherText)
			} catch (err) {
				reject(err)
			}
		})
	}

	Decryption(cipherText) {
		return new Promise((resolve, reject) => {
			try {
				const buff = Buffer.from(cipherText, this.encryptionEncoding)
				const key = Buffer.from(AES.KEY, this.bufferEncryption)
				const iv = Buffer.from(AES.IV, this.bufferEncryption)
				const decipher = cryptoObj.createDecipheriv(
					this.encryptionType,
					key,
					iv
				)
				const plainText = decipher.update(buff) + decipher.final()
				resolve(plainText)
			} catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = AES
