/**
 * @title Test project
 * @description This is a dummy project used to test readme-generator
 * Example of obfuscated code: gist.github.com
 * @logo https://raw.githubusercontent.com/javascript-obfuscator/javascript-obfuscator/master/images/logo.png
 * @installation
 * ```
 * $ npm install my-package
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
		 * @usage logAlert('Log and alert me!');
		 * @returns [string] The message sent in.
		 **/
		 console.log(message);
		 alert(message);
	 },
	 
	 doSomething: function() {
	 	/**
         * @meta doSomething [function]
	 	 * @purpose Do something special.
	 	 **/
	 }
	 	 
};
