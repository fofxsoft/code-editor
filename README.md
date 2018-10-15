# Code Editor
Online code editor with ESLint based on VS Code. [Demo](https://fofxsoft.github.io/code/example/)

## Table of Contents

  1. [Building](#building)
  1. [Rules](#rules)
  1. [Installing](#installing)
  1. [Usage](#usage)
  1. [Attributes](#attributes)
  1. [Methods](#methods)
  1. [Events](#events)
  1. [License](#license)

## Building
You will need the latest version of [Node](https://nodejs.org/en/download/) installed. The node install will include npm.

**Dependencies**

From the project folder run.
```
$ npm run install
```

Then build the project.
```
$ npm run build
```

> The build process will deploy to the build folder.

**[back to top](#)**

## Rules
[JavaScript Rules](https://github.com/fofxsoft/code-editor/blob/master/ESLINT.md)

**[back to top](#)**

## Installing
First copy the contents of the build folder to your application. Then include the following in your HTML.

```html
<link href="/lib/editor/editor.css" rel="stylesheet">
<script src="/lib/editor/editor.js"></script>
```

**[back to top](#)**

## Usage
To include a code editor on your page, simply add the tag.

```html
<input type="editor" id="skywalker" name="skywalker" language="javascript" value="">
```

or

```html
<editor id="skywalker" name="skywalker" language="javascript"></editor>
```

**[back to top](#)**

## Attributes
- **id**  
  Required. Defines the id of the code editor container, and defines the access key.
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
  - markdown

- **url**  
  Optional. This will run the defined url to fetch the editor contents. If a language is not set, this url will be used to auto detect the language.
  > When using a relative URL, the base is set to the context of the build filder, not the folder you are calling this from.

- **class**  
  Optional. Used to set the class name(s) for the code editor container.

- **style**  
  Optional. Used to define css style for the code editor container.

- **value**  
  Optional. This is only available on the editor type input field. This will populate the contents of the editor.

- **innerText**  
  Optional. This is only available for the editor tag. The innerText will populate the editor.

**[back to top](#)**

## Methods
The initialization logic will create the editors object used to access the methods.

- **get(id)**  
  This is used to get the editor object.
  &nbsp;  
  ```javascript
  const editor = editors.get("skywalker");
  ```

- **editor.code**  
  Returns a string. This will fetch the current code in the editor.
  &nbsp;  
  ```javascript
  const editor = editors.get("skywalker");
  const code = editor.code;
  ```

- **editor.code(value)**  
  This allows you to set the code in the editor.
  &nbsp;  
  ```javascript
  const editor = editors.get("skywalker");

  editor.code = "const jedi = \"light side\"";
  ```

- **editor.focus()**  
  This will focus the editor.
  &nbsp;  
  ```javascript
  const editor = editors.get("skywalker");

  editor.focus();
  ```


- **editor.fix()**  
  This will apply any eslint fixable errors automatically.
  &nbsp;  
  ```javascript
  const editor = editors.get("skywalker");

  editor.fix();
  ```

- **editor.errors**  
  Returns an array of eslint error messages.
  &nbsp;  
  ```javascript
  const editor = editors.get("skywalker");
  const errors = editor.errors;
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

**[back to top](#)**

## Events
Custom events applied to the editor tag.

- **ready**  
  This event is dispached when the editor is loaded and ready to accept commands.
  &nbsp;  
  ```javascript
  document.getElementById("skywalker").addEventListener("ready", () => {
      editors.get("skywalker").focus();
  });
  ```

- **input**  
  This event is dispached on every edit.
  &nbsp;  
  ```javascript
  document.getElementById("skywalker").addEventListener("input", () => {
      setIsDirty(true);
  });
  ```

- **change**  
  This event is dispached when there is a change in the linter, including messages.
  &nbsp;  
  ```javascript
  document.getElementById("skywalker").addEventListener("change", () => {
      const editor = editors.get("skywalker");

      if (editor.errors.length > 0) {
          document.getElementById("button").disabled = false;
      } else {
          document.getElementById("button").disabled = true;
      };
  });
  ```

**[back to top](#)**

## License
[MIT](https://github.com/fofxsoft/code-editor/blob/master/LICENSE.md)

**[back to top](#)**
