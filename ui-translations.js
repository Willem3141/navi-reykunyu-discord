module.exports = _;

let strings = {}

strings['en'] = {
	'language': 'English',
	'mode-navi-description': 'Enter a Na\'vi word or sentence, get the English translation',
	'mode-english-description': 'Enter word in English, get matching Na\'vi words',
	'mode-annotated-description': 'Search Plumps\' Annotated Dictionary for usage examples',

	'error-search': 'Something went wrong while searching. This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.',

	'no-results-recognizer': 'No results',
	'no-results-navi': 'No results found for Na\'vi → English.',
	'did-you-mean': 'Did you mean',

	'infix-abbreviation': 'inf.',
	'image-drawn-by': 'drawn by',
	'affixes-header': 'Affixes:',
	'omitted-more': 'more',

	/*'stress-unknown': '(stress pattern unknown)',

	'status-unconfirmed': 'unconfirmed word',
	'status-unconfirmed-header': 'Unconfirmed:',
	'status-unofficial': 'unofficial word',
	'status-unofficial-header': 'Unofficial:',
	'status-loan': 'loanword',
	'status-loan-header': 'Loanword:',
	'status-unconfirmed-explanation': 'This word has never been officially confirmed by Paul Frommer. Keep that in mind if you decide to use it.',
	'status-loan-explanation': 'This word was loaned from English or another Earth language. For completeness, we include loanwords in this dictionary if and only if Paul Frommer has used them in one of his writings. However, since any word could be loaned into Na\'vi if the need arises to talk about Earth concepts, this distinction is by definition arbitrary.',

	'etymology': 'Etymology',
	'etymology-from': 'From',
	'derived': 'Derived words',

	'source': 'Source',

	'see-also': 'See also',

	'conjugated-forms': 'Conjugated forms',
	'singular': 'singular',
	'dual': 'dual',
	'trial': 'trial',
	'plural': 'plural',
	'subjective': 'subjective',
	'agentive': 'agentive',
	'patientive': 'patientive',
	'dative': 'dative',
	'genitive': 'genitive',
	'topical': 'topical',
	'or': 'or',

	'attributive-forms': 'Attributive forms',

	'infix-positions': 'Infix positions',

	'sentence-search': 'Sentence search',
	'usages-found-singular': 'usage found',
	'usages-found-plural': 'usages found',

	'no-results': 'No results found',
	'no-results-description-navi': 'If you\'re searching for an English word, please switch to <i>English &rarr; Na\'vi</i> mode.',
	'no-results-description-english': 'If you\'re searching for a Na\'vi word, please switch to <i>Na\'vi &rarr; English</i> mode.',
	'no-results-description-annotated': 'Reykunyu can find only single words without affixes in the Annotated Dictionary. If you\'re searching for a conjugated word Na\'vi word, or a string of words, please switch to <i>Na\'vi &harr; English</i> mode.',

	'not-found': '(not found)',

	'searching-error': 'Something went wrong while searching',
	'searching-error-description': 'Please try again later. If the problem persists, please <a href="//wimiso.nl/contact">contact</a> me.',
	'parsing-error': 'Something went wrong while analyzing your sentence',

	'syllable': 'syllable',
	'syllables': 'syllables',
	'stressed-on': 'stressed on syllable',*/
}

strings['de'] = {
	'language': 'Deutsch',

	'did-you-mean': 'Meintest du',

	/*'type-n': 'Nomen',
	'type-n:unc': 'Nomen',
	'type-n:si': 'intransitives Verb',
	'type-n:pr': 'Eigenname',
	'type-pn': 'Pronomen',
	'type-adj': 'Adjektiv',
	'type-num': 'Numeral',
	'type-adv': 'Adverb',
	'type-adp': 'Adposition',
	'type-adp:len': 'lenisierende Adposition',
	'type-intj': 'Interjektion',
	'type-part': 'Partikel',
	'type-conj': 'Konjunktion',
	'type-ctr': 'Nebensatzeinleiter ("F-Wort")',
	'type-v:?': 'Verb, unbekannte Art',
	'type-v:in': 'intransitives Verb',
	'type-v:tr': 'transitives Verb',
	'type-v:m': 'Modalverb',
	'type-v:si': 'intransitives Verb',
	'type-v:cp': 'Kopula',
	'type-phr': 'Phrase',
	'type-inter': 'Fragewort',
	'type-aff:pre': 'Präfix',
	'type-aff:in': 'Infix',
	'type-aff:suf': 'Suffix',
	'type-nv:si': 'intransitives Verb',

	'stress-unknown': '(Betonung unbekannt)',

	'status-unconfirmed': 'Unbestätigtes Wort',
	'status-unconfirmed-header': 'Unbestätigt:',
	'status-unofficial': 'Inoffizielles Wort',
	'status-unofficial-header': 'Inoffiziell:',
	'status-loan': 'Lehnwort',
	'status-loan-header': 'Lehnwort:',
	'status-unconfirmed-explanation': 'Dieses Wort wurde nie offiziell von Paul Frommer bestätigt. Sei dir dessen bewusst, wenn du es verwenden möchtest.',
	'status-loan-explanation': 'Dieses Wort wurde der englischen oder einer anderen Sprache der Erde entlehnt.  Der Vollständigkeit halber schließen wir Lehnwörter in diesem Wörterbuch ein, und auch nur, sofern Paul Frommer diese in einem seiner Texte verwendet hat. Da jedoch theoretisch jedes Wort in die Sprache der Na\'vi entlehnt werden kann, wenn die Notwendigkeit dafür besteht, über Erdkonzepte zu sprechen, findet diese Unterscheidung nach eigenem Ermessen statt.',

	'image-drawn-by': 'gezeichnet von',

	'etymology': 'Etymologie',
	'etymology-from': 'Von',

	'source': 'Quelle',

	'see-also': 'Siehe auch',

	'conjugated-forms': 'Konjugierte Formen',
	'singular': 'Singular',
	'dual': 'Dual',
	'trial': 'Trial',
	'plural': 'Plural',
	'subjective': 'Subjektiv',
	'agentive': 'Agentiv',
	'patientive': 'Patientiv',
	'dative': 'Dativ',
	'genitive': 'Genitiv',
	'topical': 'Topical',
	'or': 'oder',

	'attributive-forms': 'Attributive Formen',

	'infix-positions': 'Infixpositionen',

	'sentence-search': 'Satzsuche',
	'usages-found-singular': 'gefundene Anwendung',
	'usages-found-plural': 'gefundene Anwendungen',

	'no-results': 'Keine Ergebnisse gefunden',
	'no-results-description-navi': 'Du willst nach einem deutschen Wort suchen? Dann stelle oben den Modus auf <i>Deutsch &rarr; Na\'vi</i>.',
	'no-results-description-english': 'Du willst nach einem Na\'vi-Wort suchen? Dann stelle oben den Modus auf <i>Na\'vi &rarr; Deutsch</i>.',

	'omitted-more': 'mehr',
	'not-found': '(nicht gefunden)',

	'searching-error': 'Bei der Suche ist etwas schiefgelaufen',
	'searching-error-description': 'Bitte versuche es später erneut. Falls dieses Problem fortbestehen sollte, <a href="//wimiso.nl/contact">wende dich bitte an mich</a>.',*/
}

strings['nl'] = {
	'language': 'Nederlands',
	'mode-navi-description': 'Zoekt de Nederlandse vertaling van een Na\'vi-woord of -zin',
	'mode-english-description': 'Zoekt Na\'vi-woorden voor een gegeven Nederlands woord',
	'mode-annotated-description': 'Zoekt in Plumps\' Annotated Dictionary naar voorbeeldzinnen',

	'error-search': 'Er is een fout opgetreden tijdens het zoeken. Da\'s niet de bedoeling, dus ik ping even <@163315929760006144> zodat dit probleem opgelost kan worden.',

	'no-results-recognizer': 'Geen resultaten',
	'no-results-navi': 'Geen resultaten voor Na\'vi → Nederlands.',
	'did-you-mean': 'Bedoelde je misschien',

	/*'stress-unknown': '(klemtoon onbekend)',

	'status-unconfirmed': 'onbevestigd woord',
	'status-unconfirmed-header': 'Onbevestigd:',
	'status-unofficial': 'niet-officieel woord',
	'status-unofficial-header': 'Niet-officieel:',
	'status-loan': 'leenwoord',
	'status-loan-header': 'Leenwoord:',
	'status-unconfirmed-explanation': 'Dit woord is niet officieel bevestigd door Paul Frommer. Houd daar rekening mee als je het gebruikt.',
	'status-loan-explanation': 'Dit woord is overgenomen uit het Engels of een andere Aardse taal. Voor de volledigheid nemen we leenwoorden op in dit woordenboek als en alleen als Paul Frommer ze gebruikt heeft in een van zijn teksten. Echter, omdat ieder woord in principe geleend kan worden in het Na\'vi als men het over Aardse concepten heeft, is dit onderscheid per definitie arbitrair.',

	'image-drawn-by': 'getekend door',

	'etymology': 'Etymologie',
	'etymology-from': 'Van',
	'derived': 'Afgeleide woorden',

	'source': 'Bron',

	'see-also': 'Zie ook',

	'conjugated-forms': 'Verbogen vormen',
	'singular': 'enkelvoud',
	'dual': 'tweevoud',
	'trial': 'drievoud',
	'plural': 'meervoud',
	'subjective': 'subjectief',
	'agentive': 'agentief',
	'patientive': 'patientief',
	'dative': 'datief',
	'genitive': 'genitief',
	'topical': 'topical',
	'or': 'of',

	'attributive-forms': 'Attributieve vormen',

	'infix-positions': 'Infix-posities',

	'sentence-search': 'Zoek in zinnen',
	'usages-found-singular': 'voorkomen gevonden',
	'usages-found-plural': 'voorkomens gevonden',

	'no-results': 'Geen resultaten',
	'no-results-description-navi': 'Heb je een Nederlandse zoekterm ingevoerd, zet dan hierboven de modus op <i>Nederlands &rarr; Na\'vi</i>.',
	'no-results-description-english': 'Heb je een zoekterm in het Na\'vi ingevoerd, zet dan hierboven de modus op <i>Na\'vi &rarr; Nederlands</i>.',

	'omitted-more': 'meer',
	'not-found': '(niet gevonden)',

	'searching-error': 'Er ging iets mis tijdens het zoeken',
	'searching-error-description': 'Probeer het later opnieuw. Als het probleem aanhoudt, <a href="//wimiso.nl/contact">laat het dan weten</a>.',

	'syllable': 'lettergreep',
	'syllables': 'lettergrepen',
	'stressed-on': 'klemtoon op lettergreep',*/
}

strings['x-navi'] = {
	'language': 'Na’vi',

	/*'stress-unknown': '(lì’upam akawnomum)',

	'status-unconfirmed': 'unconfirmed word',
	'status-unconfirmed-header': 'Unconfirmed:',
	'status-unofficial': 'unofficial word',
	'status-unofficial-header': 'Unofficial:',
	'status-loan': 'loanword',
	'status-loan-header': 'Loanword:',
	'status-unconfirmed-explanation': 'This word has never been officially confirmed by Paul Frommer. Keep that in mind if you decide to use it.',
	'status-loan-explanation': 'This word was loaned from English or another Earth language. For completeness, we include loanwords in this dictionary if and only if Paul Frommer has used them in one of his writings. However, since any word could be loaned into Na\'vi if the need arises to talk about Earth concepts, this distinction is by definition arbitrary.',

	'image-drawn-by': '&ndash; reltse’o a ta',

	'etymology': 'Fìlì’uä tsim',
	'etymology-from': 'Ta',
	'derived': 'Fìlì’uta a aylì’u',

	'source': 'Säomumä tsim',

	'see-also': 'Tawnarea aylì’u',

	'conjugated-forms': 'Aysrey alawnatem',
	'singular': '’aw',
	'dual': 'mune',
	'trial': 'pxey',
	'plural': 'pxay',
	'subjective': 'subjective',
	'agentive': 'agentive',
	'patientive': 'patientive',
	'dative': 'dative',
	'genitive': 'genitive',
	'topical': 'topical',
	'or': 'fu',

	'attributive-forms': 'Attributive forms',

	'infix-positions': 'Kemlì’uviyä meseng',

	'sentence-search': 'Sentence search',
	'usages-found-singular': 'usage found',
	'usages-found-plural': 'usages found',

	'no-results': 'Ke rìmun kea aylì’ut',
	'no-results-description-navi': 'Txo ngal fwivew lì’uti fa lì’fya alahe, tsakrr rutxe io fìpamrel ftxivey tsalì’fyat.',
	'no-results-description-english': 'You shouldn’t be able to see this text. If you do, please panic and inform Wllìm ;)',  // Na’vi language doesn’t allow reverse searching because it makes no sense
	'did-you-mean': 'Srake kolan lì’ut alu',

	'omitted-more': 'nì’ul',
	'not-found': '(ke rìmun)',

	'searching-error': 'Fwew a krr kxeyey lìmen',
	'searching-error-description': 'Rutxe mawkrr fmi nìmum. Txo fìtìngäzìk ’ivì’awn, tsakrr rutxe <a href="//wimiso.nl/contact">peng</a> oehu.',*/
}

strings['et'] = {
	'language': 'Eesti'
}

strings['fr'] = {
	'language': 'Français',

	/*'stress-unknown': '(accentuation tonique inconnue)',

	'status-unconfirmed': 'mot non confirmé',
	'status-unconfirmed-header': 'Non confirmé:',
	'status-unofficial': 'mot non officiel',
	'status-unofficial-header': 'Non officiel:',
	'status-loan': 'mot emprunté',
	'status-loan-header': 'Mot emprunté:',
	'status-unconfirmed-explanation': 'Ce mot n’a jamais été officiellement confirmé par Paul Frommer. Veuillez garder cela à l’esprit si vous décidez de l’utiliser.',
	'status-loan-explanation': 'Ce mot a été emprunté de l’anglais ou d’une langue terrestre. Pour une documentation complète de la langue, nous incluons les emprunts si et seulement si Paul Frommer les a utilisés dans ses écrits. Cependant, puisque n’importe quel mot peut être emprunté par le Na’vi, si le besoin de parler des concepts terriens survient, cette distinction est par définition arbitraire.',

	'image-drawn-by': 'dessiné par',

	'etymology': 'Étymologie',
	'etymology-from': 'De',
	'derived': 'Mots dérivés',

	'source': 'Source',

	'see-also': 'See also',

	'conjugated-forms': 'Formes conjuguées',
	'singular': 'singulier',
	'dual': 'duel',
	'trial': 'triel',
	'plural': 'pluriel',
	'subjective': 'cas sujet',
	'agentive': 'agentif',
	'patientive': 'patientif',
	'dative': 'datif',
	'genitive': 'génitif',
	'topical': 'topical',
	'or': 'or',

	'attributive-forms': 'Formes attributives',

	'infix-positions': 'Emplacement des infixes',

	'sentence-search': 'Recherche de phrase',
	'usages-found-singular': 'usage trouvé',
	'usages-found-plural': 'usages trouvés',

	'no-results': 'Aucuns résultats',
	'no-results-description-navi': 'Si vous cherchez un mot en français, veuillez basculer vers le mode <i>Français &rarr; Na\'vi</i>.',
	'no-results-description-english': 'Si vous cherchez un mot en na’vi, veuillez basculer vers le mode <i>Na\'vi &rarr; Français</i>.',
	'did-you-mean': 'Did you mean',

	'omitted-more': 'plus',
	'not-found': '(pas trouvé)',

	'searching-error': 'Un problème est survenu pendant la recherche',
	'searching-error-description': 'Veuillez s’il vous plait essayer plus tard. Si le problème persiste, veuillez s’il vous plaît me <a href="//wimiso.nl/contact">contacter</a>.',*/
}

strings['hu'] = {
	'language': 'Magyar'
}

strings['pl'] = {
	'language': 'Polski'
}

strings['ru'] = {
	'language': 'Русский'
}

strings['sv'] = {
	'language': 'Svenska'
}

function _(key, lang) {
	if (strings.hasOwnProperty(lang) && strings[lang].hasOwnProperty(key)) {
		return strings[lang][key];
	} else if (strings['en'].hasOwnProperty(key)) {
		return strings['en'][key];
	} else {
		return '[' + key + ']';
	}
}

