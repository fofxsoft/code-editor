var bad = function () {
    return new Promise(function(then) {
        setTimeout(function () {
            then('Encompass Platform');
        }, 300);
    });
}

bad().then(function(response) {
    var message = 'Hello ' + response + '!';

    document.write(message);
});


function better() {
    return new Promise((then) => {
        setTimeout(() => {
            then("Encompass Platform");
        }, 300);
    });
}

better().then((response) => {
    document.write(`Hello ${response}!`);
});


function best() {
    return new Promise(then => setTimeout(() => then("Encompass Platform"), 300));
}

best().then(response => document.write(`Hello ${response}!`));
