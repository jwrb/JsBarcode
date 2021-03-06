'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE2 = require('./CODE128.js');

var _CODE3 = _interopRequireDefault(_CODE2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CODE128C = function (_CODE) {
	_inherits(CODE128C, _CODE);

	function CODE128C(string) {
		_classCallCheck(this, CODE128C);

		return _possibleConstructorReturn(this, _CODE.call(this, String.fromCharCode(210) + string));
	}

	CODE128C.prototype.valid = function valid() {
		return this.string.search(/^(\xCF*[0-9]{2}\xCF*)+$/) !== -1;
	};

	return CODE128C;
}(_CODE3.default);

exports.default = CODE128C;