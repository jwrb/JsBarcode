class EAN13{
	constructor(string, options){
		//Add checksum if it does not exist
		if(string.search(/^[0-9]{12}$/)!=-1){
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
	}

	valid(){
		return this.string.search(/^[0-9]{13}$/) !== -1 &&
			this.string[12] == this.checksum(this.string);
	}

	options(options){
		options.textMargin = 0;
		if(options.fontSize > options.width * 11){
			options.fontSize = options.width * 11;
		}
	}

	encode(){
		var encoder = new EANencoder();
		var result = [];

		var structure = this.structure[this.string[0]];

		//Get the string to be encoded on the left side of the EAN code
		var leftSide = this.string.substr(1,6);

		//Get the string to be encoded on the right side of the EAN code
		var rightSide = this.string.substr(7,6);

		// Add the first digigt
		result.push({data: "000000000000", text: this.string[0], options: {textAlign: "left"}});

		//Add the guard bars
		result.push({data: [1.1, 0, 1.1]});

		//Add the left side
		result.push({data: encoder.encode(leftSide, structure), text: leftSide});

		//Add the middle bits
		result.push({data: [0, 1.1, 0, 1.1, 0]});

		//Add the right side
		result.push({data: encoder.encode(rightSide, "RRRRRR"), text: rightSide});

		//Add the end bits
		result.push({data: [1.1, 0, 1.1]});

		return result;
	};

	//Calulate the checksum digit
	checksum(number){
		var result = 0;

		var i;
		for(i=0;i<12;i+=2){result+=parseInt(number[i]);}
		for(i=1;i<12;i+=2){result+=parseInt(number[i])*3;}

		return (10 - (result % 10)) % 10;
	}
}

class EAN8{
	constructor(string){
		//Add checksum if it does not exist
		if(string.search(/^[0-9]{7}$/) !== -1){
			this.string = string + this.checksum(string);
		}
		else{
			this.string = string;
		}
	}

	valid(){
		return this.string.search(/^[0-9]{8}$/) !== -1 &&
			this.string[7] == this.checksum(this.string);
	};

	encode(){
		var encoder = new EANencoder();

		//Create the return variable
		var result = "";

		//Get the number to be encoded on the left side of the EAN code
		var leftSide = this.string.substr(0,4);

		//Get the number to be encoded on the right side of the EAN code
		var rightSide = this.string.substr(4,4);

		//Add the start bits
		result += encoder.startBin;

		//Add the left side
		result += encoder.encode(leftSide, "LLLL");

		//Add the middle bits
		result += encoder.middleBin;

		//Add the right side
		result += encoder.encode(rightSide,"RRRR");

		//Add the end bits
		result += encoder.endBin;

		return {
			data: result,
			text: this.string
		};
	};

	//Calulate the checksum digit
	checksum(number){
		var result = 0;

		var i;
		for(i=0;i<7;i+=2){result+=parseInt(number[i])*3;}
		for(i=1;i<7;i+=2){result+=parseInt(number[i]);}

		return (10 - (result % 10)) % 10;
	}
}

class EAN5{
	constructor(string){
		this.string = string;

		this.structure = [
			"GGLLL",
			"GLGLL",
			"GLLGL",
			"GLLLG",
			"LGGLL",
			"LLGGL",
			"LLLGG",
			"LGLGL",
			"LGLLG",
			"LLGLG"
		];
	}

	valid(){
		return this.string.search(/^[0-9]{5}$/)!==-1;
	};

	encode(){
		var encoder = new EANencoder();

		var result = "1011" +
			encoder.encode(this.string, this.structure[this.checksum(this.string)], "01");

		return {
			data: result,
			text: this.string
		};
	};

	checksum(){
		var result = 0;

		var i;
		for(i=0;i<5;i+=2){result+=parseInt(this.string[i])*3;}
		for(i=1;i<5;i+=2){result+=parseInt(this.string[i])*9;}

		return result % 10;
	}
}

class EAN2{
	constructor(string){
		this.string = string;

		this.structure = ["LL", "LG", "GL", "GG"];
	}

	valid(){
		return this.string.search(/^[0-9]{2}$/)!==-1;
	}

	encode(){
		var encoder = new EANencoder();

		var result = "1011" +
			encoder.encode(this.string, this.structure[parseInt(this.string) % 4], "01");

		return {
			data: result,
			text: this.string
		};
	}
}

class UPC extends EAN13{
	constructor(string, options){
		super("0" + string, options);
	}
}

//
// Help class that does all the encoding
//
class EANencoder{
	constructor(){
		this.startBin = "101";
		this.endBin = "101";
		this.middleBin = "01010";

		//The L (left) type of encoding
		this.Lbinary = [
			"0001101",
			"0011001",
			"0010011",
			"0111101",
			"0100011",
			"0110001",
			"0101111",
			"0111011",
			"0110111",
			"0001011"
		];

		//The G type of encoding
		this.Gbinary = [
			"0100111",
			"0110011",
			"0011011",
			"0100001",
			"0011101",
			"0111001",
			"0000101",
			"0010001",
			"0001001",
			"0010111"
		];

		//The R (right) type of encoding
		this.Rbinary = [
			"1110010",
			"1100110",
			"1101100",
			"1000010",
			"1011100",
			"1001110",
			"1010000",
			"1000100",
			"1001000",
			"1110100"
		];
	}

	//Convert a numberarray to the representing
	encode(number, structure, separator){
		//Create the variable that should be returned at the end of the function
		var result = "";

		separator = typeof separator === "undefined" ? "" : separator;

		//Loop all the numbers
		for(var i = 0;i<number.length;i++){
			//Using the L, G or R encoding and add it to the returning variable
			if(structure[i]=="L"){
				result += this.Lbinary[number[i]];
			}
			else if(structure[i]=="G"){
				result += this.Gbinary[number[i]];
			}
			else if(structure[i]=="R"){
				result += this.Rbinary[number[i]];
			}

			// Add separator
			if(i < number.length - 1){
				result += separator;
			}
		}
		return result;
	};
}


//Required to register for both browser and nodejs
function register(core){
	core.register(EAN13, /^EAN(.?13)?$/i, 8);
	core.register(EAN8, /^EAN.?8$/i, 8);
	core.register(EAN5, /^EAN.?5$/i, 5);
	core.register(EAN2, /^EAN.?2$/i, 5);
	core.register(UPC, /^UPC(.?A)?$/i, 8);
}
export default register;