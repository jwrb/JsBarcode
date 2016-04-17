import EANencoder from './ean_encoder.js'

class EAN13{
	constructor(string, options){
		//Add checksum if it does not exist
		if(string.search(/^[0-9]{12}$/) !== 	-1){
			this.string = string + this.checksum(string);
		}
		else{
			this.string = string;
		}

		// Define the EAN-13 structure
		this.structure = [
			"LLLLLL",
			"LLGLGG",
			"LLGGLG",
			"LLGGGL",
			"LGLLGG",
			"LGGLLG",
			"LGGGLL",
			"LGLGLG",
			"LGLGGL",
			"LGGLGL"
		];

		if(options.fontSize > options.width * 10){
			this.fontSize = options.width * 10;
		}
		else{
			this.fontSize = options.fontSize;
		}

		this.guardHeight = options.height + this.fontSize / 2 + options.textMargin;
	}

	valid(){
		return this.string.search(/^[0-9]{13}$/) !== -1 &&
			this.string[12] == this.checksum(this.string);
	}

	encode(){
		var encoder = new EANencoder();
		var result = [];

		var structure = this.structure[this.string[0]];

		//Get the string to be encoded on the left side of the EAN code
		var leftSide = this.string.substr(1, 6);

		//Get the string to be encoded on the right side of the EAN code
		var rightSide = this.string.substr(7, 6);

		// Add the first digigt
		result.push({
			data: "000000000000",
			text: this.string[0],
			options: {textAlign: "left", fontSize: this.fontSize}
		});

		//Add the guard bars
		result.push({
			data: "101",
			options: {height: this.guardHeight}
		});

		//Add the left side
		result.push({
			data: encoder.encode(leftSide, structure),
			text: leftSide,
			options: {fontSize: this.fontSize}
		});

		//Add the middle bits
		result.push({
			data: "01010",
			options: {height: this.guardHeight}
		});

		//Add the right side
		result.push({
			data: encoder.encode(rightSide, "RRRRRR"),
			text: rightSide,
			options: {fontSize: this.fontSize}
		});

		//Add the end bits
		result.push({
			data: "101",
			options: {height: this.guardHeight}
		});

		return result;
	}

	//Calulate the checksum digit
	checksum(number){
		var result = 0;

		var i;
		for(i = 0; i < 12; i += 2){
			result += parseInt(number[i]);
		}
		for(i = 1; i < 12; i += 2){
			result += parseInt(number[i]) * 3;
		}

		return (10 - (result % 10)) % 10;
	}
}

export default EAN13;