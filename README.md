# Code Editor
Inline code editor with ESLint based on VS Code.

## Table of Contents

  1. [Building](#building)
  1. [Rules](#rules)
  1. [Installing](#installing)
  1. [Usage](#usage)
  1. [Attributes](#attributes)
  1. [Methods](#methods)
  1. [License](#license)

## Building
You will need the latest version of [Node](https://nodejs.org/en/download/) installed. The node install will include npm.

**Dependencies**

In the terminal navigate to the project folder.
```
$ cd code-editor
```

Then install the dependencies.
```
$ npm install
```

**Monaco**

In the terminal navigate to the monaco folder.
```
$ cd code-editor/monaco/
```

Then build monaco.
```
$ npm run build
```

**Editor**

In the terminal navigate to the editor folder.
```
$ cd code-editor/editor
```

Then build the editor.
```
$ npm run build
```

> The editor build process will copy over the build files to the build/editor folder. You should now have fresh files in the build folder.

**[back to top](#table-of-contents)**

## Rules
[JavaScript Rules](https://github.com/fofxsoft/code-editor/blob/master/ESLINT.md)

**[back to top](#table-of-contents)**

## Installing
First copy the build/editor folder to your application. Then include the following in your HTML.

```html
<link href="editor/editor.css" rel="stylesheet">
<script src="editor/editor.js"></script>
```

**[back to top](#table-of-contents)**

## Usage
To include a code editor on your page, simply add the tag.

```html
<input type="editor" id="skywalker" name="skywalker" language="javascript" value="">
```

or

```html
<editor id="skywalker" name="skywalker" language="javascript"></editor>
```

**[back to top](#table-of-contents)**

## Attributes
- **id**  
  Required. Defines the id of the code editor container, and defines access key.
  > Without an id, you will not be able to access the edited code of linter messages.

- **name**  
  Optional. Sets the name of the code editor container.
  > Adding this will NOT append the edited code to a POST request. You must use the getCode() method.

- **language**  
  Optional. This is required when you are setting the code inline or with the setCode() method. If the language is not set it will attempt to find the language from the defined url. If the language can not be determined the language is set to text.  
  &nbsp;  
  Available languages.
  - javascript
  - typescript
  - html
  - css
  - less
  - scss
  - sass
  - xml
  - json
  - sql
  - mysql
  - vb
  - csharp

- **url**  
  Optional. This will run the defined url to fetch the editor contents. If a language is not set, this url will be used to auto detect the language.
  > When using a relative URL, the base is set to the context of the build/editor filder, not the folder you are calling this from.

- **class**  
  Optional. Used to set the class name(s) for the code editor container.

- **style**  
  Optional. Used to define css style for the code editor container.

- **value**  
  Optional. This is only available on the editor type input field. This will populate the contents of the editor.

- **innerText**  
  Optional. This is only available for the editor tag. The innerText will populate the editor

**[back to top](#table-of-contents)**

## Methods
The initialization logic will create the editor array used to access the methods.

- **getCode()**  
  Returns a string. This will fetch the current code in the editor.  
  &nbsp;  
  ```javascript
  const jsEditor = editor["skywalker"];
  const code = jsEditor.getCode();
  ```

- **setCode()**  
  This allows you to set the code in the editor.  
  &nbsp;  
  ```javascript
  const jsEditor = editor["skywalker"];

  jsEditor.setCode(const jedi = "light side");
  ```

- **setCode()**  
  Returns an array of objects. This allows you to set the code in the editor.  
  &nbsp;  
  ```javascript
  const jsEditor = editor["skywalker"];
  const errors = jsEditor.getErrors();
  ```

  Each message consists of some or all of these parameters.
  - **ruleId**  
    String. Name of the ESLint rule.

  - **severity**  
    Integer. Level of the error.

  - **message**  
    String. Friendly error message.

  - **line**  
    Integer. Line where the error first starts.

  - **column**  
    Integer. Column where the error starts.

  - **endLine**  
    Integer. Line where the error ends.

  - **endColumn**  
    Integer. Column where the error ends.

  - **nodeType**  
    String. Type of the object where the error occurred.

  - **fix**  
    Object. Object to assist auto fixing.

**[back to top](#table-of-contents)**

## License
[MIT](https://github.com/fofxsoft/code-editor/blob/master/LICENSE.md)

**[back to top](#table-of-contents)**
