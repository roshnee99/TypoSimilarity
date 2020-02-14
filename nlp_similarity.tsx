import * as Distance from "./distance";


function addPromising({promisingIndicesArray, wordWindow, correctWords, distanceBarrier, index}: {
    promisingIndicesArray: number[], wordWindow: string, correctWords: string[],  distanceBarrier: number, index: number
    }) {
    for (var j = 0; j < correctWords.length; j++) {
        var d = Distance.dLDistance( {a: wordWindow, b: correctWords[j]  }  );
        if (d < distanceBarrier) {
            promisingIndicesArray.push(index);
        }
    }
}

function appendStringArrayWithSpace( {array}: {array: string[]} ) : string {
    var string = "";
    for (var i = 0; i < array.length; i++) {
        string += array[i] + " ";
    }
    return string;
}

function countWhiteSpacesInString( {text}: {text:string} ) : number {
    var count = 0;
    if (text == null) {
        return 0;
    }

    for (var i = 0; i < text.length; i++) {
        if (text.charAt[i] == " ") {
            count++;
        }
    }
    return count;
}

function gettopFiveArray( {promisingIndicesArray, wordsArray, topFiveArray}: { promisingIndicesArray: number[], wordsArray: string[], topFiveArray: string[]  } ) {
    for (var i = 0; i < promisingIndicesArray.length; i++)  {
        var index = promisingIndicesArray[i];
        var backwardsWindow = index-10;
        var forwardsWindow = index+40;

        var sentence: string;
        if (backwardsWindow < 0 && forwardsWindow >= wordsArray.length) {
            sentence = appendStringArrayWithSpace( {array: wordsArray.slice(0, wordsArray.length)});
        } else if (backwardsWindow < 0 && forwardsWindow < wordsArray.length) {
            sentence = appendStringArrayWithSpace( {array: wordsArray.slice(0, forwardsWindow)});
        } else if (backwardsWindow >= 0 && forwardsWindow >= wordsArray.length) {
            sentence = appendStringArrayWithSpace( {array: wordsArray.slice(backwardsWindow, wordsArray.length)});
        } else {
            sentence = appendStringArrayWithSpace( {array: wordsArray.slice(backwardsWindow, forwardsWindow)});
        }
        if (i > 4) {
            break;
        }
        topFiveArray.push(sentence);
    }
}

var promisingIndices =  new Array<number>();
var words = new Array<string>();

function findPhrases( {wordsToFind, text}: {wordsToFind: string[], text: string}  ): string[] {
    // sort words by number of words
    var allWordsToFind =  new Array<string[]>(6);
    for (var i = 0; i < allWordsToFind.length; i++) {
        allWordsToFind[i] = new Array<string>();
    }

    //put words into array corresponding by how mnay words in the phrase
    for (var i = 0; i < wordsToFind.length; i++) {
        var numWhiteSpace = countWhiteSpacesInString({text: wordsToFind[i]} );
        if (numWhiteSpace <= 5 && wordsToFind[i].length > 2) {
            allWordsToFind[numWhiteSpace].push(wordsToFind[i]);
        }
    }

    words = text.split(" ");
    for (var i = 0; i < words.length; i++) {
        var wordToCheck = words[i];
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[0], distanceBarrier: 2, index: i}  );
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[1], distanceBarrier: 3, index: i}  );
    }

    for (var i = 0; i < words.length-1; i++) {
        var wordToCheck = appendStringArrayWithSpace( {array: words.slice(i, i+2)});
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[0], distanceBarrier: 2, index: i}  );
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[1], distanceBarrier: 3, index: i}  );
    }

    for (var i = 0; i < words.length-2; i++) {
        var wordToCheck = appendStringArrayWithSpace( {array: words.slice(i, i+3)});
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[2], distanceBarrier: 4, index: i}  );
    }

    for (var i = 0; i < words.length-3; i++) {
        var wordToCheck = appendStringArrayWithSpace( {array: words.slice(i, i+4)});
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[3], distanceBarrier: 5, index: i}  );
    }

    for (var i = 0; i < words.length-4; i++) {
        var wordToCheck = appendStringArrayWithSpace( {array: words.slice(i, i+5)});
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[4], distanceBarrier: 6, index: i}  );
    }

    for (var i = 0; i < words.length-5; i++) {
        var wordToCheck = appendStringArrayWithSpace( {array: words.slice(i, i+6)});
        addPromising( {promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[5], distanceBarrier: 8, index: i}  );
    }

    //remove duplicates from the promising indices array
    promisingIndices = promisingIndices.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });
    //declare top 5 array
    var topFive = new Array<string>(5);
    gettopFiveArray( { promisingIndicesArray: promisingIndices, wordsArray: words, topFiveArray: topFive  } )

    if (promisingIndices.length < 5) {
        for (var i = promisingIndices.length; i < 5; i++) {
            topFive[i] = "Could not find another phrase"
        }
    }

    return topFive.reverse();
}

function getWordsToHighlight() {
    var wordsToHighLight = new Array<string>();
    for (var i = 0; i < promisingIndices.length; i++) {
        wordsToHighLight.push(words[promisingIndices[i]]);
    }
    return wordsToHighLight;
}

// how to call, please comment out when actually running

var arrayOfWords = ["Karnofsky", "Lansky", "KPS", "PS", "Karnofsky Score", "ECOG PS", "Performance Status",
  "Karnofsky Performance Status", "ECOG Performance Status", "Lansky Performance Status",
  "European Cooperative Oncology Group Performance Status"];
var str = " -  Performance score ≥ 50 (Lansky for research subjects aged 16 years or younger and\n             Karnofsky for subjects older" 
var topFive = findPhrases( {wordsToFind: arrayOfWords, text: str} );

console.log(topFive);
console.log(getWordsToHighlight());
