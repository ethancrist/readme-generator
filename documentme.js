/**
 * @title Test project
 * @description This is a dummy project used to test readme-generator
 * Example of obfuscated code: gist.github.com
 * @logo https://raw.githubusercontent.com/javascript-obfuscator/javascript-obfuscator/master/images/logo.png
 * @installation
 * ```
 * npm install my-package
 * ```
 * or
 * ```
 * $ yarn add --dev my-package
 * ```
 * @author ethancrist
 **/
 
var Test = {
	/**
     * @meta Test [object]
	 * @describe This is a global test variable.
	 **/

	 logAlert: function(message) {
	 	/**
         * @meta logAlert [function]
		 * @purpose Log and alert a message in one call.
		 * @usage `logAlert('Log and alert me!');`
		 * @returns Type: `string` The message sent in.
		 **/
		 console.log(message);
		 alert(message);
	 },
	 
	 doSomething: function(options) {
	 	/**
         * @meta doSomething [function]
	 	 * @purpose Do something special.
	 	 * @options ##### `options.message`
	 	 *		    	Type: `string` Default: `Hello!`
	 	 *
	 	 * 				Removes string literals and place them in a special array. For instance, the string `"Hello World"` in `var m = "Hello World";` will be replaced with something like `var m = _0x12c456[0x1];`
	 	 * 			##### `options.logTwice`
	 	 * 				Type: `boolean` Default: `true`
	 	 **/
	 	 console.log(options.message)
	 }
	 	 
};
