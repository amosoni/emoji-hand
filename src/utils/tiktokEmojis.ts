// 抖音官方隐藏表情短代码映射 - 基于alltiktokemojis.com的46个官方表情
export const DOUYIN_SHORTCODES = {
  // 基础表情
  '[smile]': '😊',           // 粉色圆形笑脸
  '[happy]': '😄',           // 桃色脸，眯眼大笑
  '[angry]': '😠',           // 红色愤怒脸
  '[cry]': '😢',             // 蓝色哭泣脸
  '[embarrassed]': '😅',     // 害羞脸红脸
  '[surprised]': '😲',       // 惊讶脸
  '[wronged]': '🥺',         // 委屈脸
  '[shout]': '😤',           // 喊叫脸
  '[flushed]': '😳',         // 脸红脸
  '[yummy]': '😋',           // 舔嘴唇脸
  '[complacent]': '😌',      // 自满脸
  '[drool]': '🤤',           // 流口水脸
  '[scream]': '😱',          // 尖叫脸
  '[weep]': '😭',            // 哭泣脸
  '[speechless]': '😶',      // 无语脸
  '[funnyface]': '😜',       // 搞笑脸
  '[laughwithtears]': '😂',  // 笑出眼泪脸
  '[wicked]': '😈',          // 邪恶脸
  '[facewithrollingeyes]': '🙄', // 翻白眼脸
  '[sulk]': '😤',            // 生闷气脸
  '[thinking]': '🤔',        // 思考脸
  
  // 高级表情
  '[lovely]': '🥰',          // 可爱脸
  '[greedy]': '🤑',          // 贪婪脸
  '[wow]': '😮',             // 哇脸
  '[joyful]': '😆',          // 开心脸
  '[hehe]': '😅',            // 嘿嘿脸
  '[slap]': '🤚',            // 拍手脸
  '[tears]': '💧',           // 眼泪
  '[stun]': '😵',            // 眩晕脸
  '[cute]': '🥺',            // 可爱脸
  '[blink]': '😉',           // 眨眼脸
  '[disdain]': '😒',         // 不屑脸
  '[astonish]': '😱',        // 震惊脸
  '[rage]': '😡',            // 愤怒脸
  '[cool]': '😎',            // 酷脸
  '[excited]': '🤩',         // 兴奋脸
  '[proud]': '😏',           // 骄傲脸
  '[smileface]': '😊',       // 笑脸
  '[evil]': '😈',            // 恶魔脸
  '[angel]': '😇',           // 天使脸
  '[laugh]': '😂',           // 大笑脸
  '[pride]': '😍',           // 自豪脸
  '[nap]': '😴',             // 睡觉脸
  '[loveface]': '🥰',        // 爱心脸
  '[awkward]': '😅',         // 尴尬脸
  '[shock]': '😱'            // 震惊脸
};

// 抖音特有的表情组合 - 使用抖音表情短代码
export const DOUYIN_COMBINATIONS = {
  '[smile][happy][smile]': {
    en: 'I am observing and somewhat engrossed in this content',
    ja: '私は観察していて、このコンテンツに少し没頭しています',
    ko: '나는 관찰하고 있고 이 콘텐츠에 약간 몰입하고 있습니다'
  },
  '[cute][surprised][cute]': {
    en: 'Shy or bashful',
    ja: '内気または恥ずかしがり',
    ko: '수줍거나 부끄러워함'
  },
  '[scream][cool][rage][excited]': {
    en: 'OMG this is amazing!',
    ja: 'OMG これは素晴らしい！',
    ko: 'OMG 이것은 놀라워요!'
  },
  '[stun][shock][wicked][stun]': {
    en: 'I can\'t even...',
    ja: '私にはできません...',
    ko: '나는 할 수 없어요...'
  },
  '[lovely][proud][lovely][excited]': {
    en: 'This is everything!',
    ja: 'これがすべてです！',
    ko: '이것이 모든 것입니다!'
  },
  '[speechless][thinking][speechless]': {
    en: 'No words needed',
    ja: '言葉は不要',
    ko: '말이 필요 없어요'
  },
  '[excited][proud][excited]': {
    en: 'Living for this!',
    ja: 'これのために生きています！',
    ko: '이것을 위해 살고 있어요!'
  },
  '[proud][cool][proud]': {
    en: 'This is the content I signed up for',
    ja: 'これが私が登録したコンテンツです',
    ko: '이것이 내가 가입한 콘텐츠입니다'
  }
};

// 抖音表情的特殊含义 - 基于alltiktokemojis.com官方数据
export const DOUYIN_MEANINGS = {
  '😊': {
    meaning: 'Smile - A small, round, pink smiling face',
    meaning_ja: 'Smile - 小さくて丸いピンクの笑顔',
    meaning_ko: 'Smile - 작고 둥근 분홍색 웃는 얼굴',
    meaning_it: 'Smile - Un piccolo viso rosa rotondo e sorridente',
    meaning_es: 'Smile - Una pequeña cara sonriente redonda y rosada',
    meaning_fr: 'Smile - Un petit visage rose rond et souriant',
    meaning_de: 'Smile - Ein kleines, rundes, rosafarbenes lächelndes Gesicht',
    meaning_pt: 'Smile - Um pequeno rosto rosa redondo e sorridente',
    meaning_ru: 'Smile - Маленькое круглое розовое улыбающееся лицо',
    usage: 'Used to show happiness or appreciation',
    usage_ja: '幸せや感謝を表すために使用',
    usage_ko: '행복이나 감사를 표현하기 위해 사용',
    usage_it: 'Usato per mostrare felicità o apprezzamento',
    usage_es: 'Usado para mostrar felicidad o apreciación',
    usage_fr: 'Utilisé pour montrer le bonheur ou l\'appréciation',
    usage_de: 'Wird verwendet, um Glück oder Wertschätzung zu zeigen',
    usage_pt: 'Usado para mostrar felicidade ou apreciação',
    usage_ru: 'Используется для выражения счастья или признательности',
    example: 'Thank you [smile] 😊',
    example_ja: 'ありがとう [smile] 😊',
    example_ko: '고마워 [smile] 😊',
    example_it: 'Grazie [smile] 😊',
    example_es: 'Gracias [smile] 😊',
    example_fr: 'Merci [smile] 😊',
    example_de: 'Danke [smile] 😊',
    example_pt: 'Obrigado [smile] 😊',
    example_ru: 'Спасибо [smile] 😊'
  },
  '😄': {
    meaning: 'Happy - A peach-colored face with squinty eyes and a big open mouth',
    meaning_ja: 'Happy - 細い目と大きな口を開けた桃色の顔',
    meaning_ko: 'Happy - 작은 눈과 큰 입을 연 분홍색 얼굴',
    meaning_it: 'Happy - Un viso color pesca con occhi socchiusi e una grande bocca aperta',
    meaning_es: 'Happy - Una cara color melocotón con ojos entrecerrados y una boca grande abierta',
    meaning_fr: 'Happy - Un visage couleur pêche avec des yeux plissés et une grande bouche ouverte',
    meaning_de: 'Happy - Ein pfirsichfarbenes Gesicht mit zusammengekniffenen Augen und einem großen offenen Mund',
    meaning_pt: 'Happy - Um rosto cor pêssego com olhos semicerrados e uma boca grande aberta',
    meaning_ru: 'Happy - Персиковое лицо с прищуренными глазами и большим открытым ртом',
    usage: 'Expressing extreme excitement',
    usage_ja: '極度の興奮を表現',
    usage_ko: '극도의 흥분을 표현',
    usage_it: 'Esprimere estrema eccitazione',
    usage_es: 'Expresar extrema emoción',
    usage_fr: 'Exprimer une excitation extrême',
    usage_de: 'Extreme Aufregung ausdrücken',
    usage_pt: 'Expressar extrema excitação',
    usage_ru: 'Выражать крайнее возбуждение',
    example: 'I\'m so [happy] today! 😄',
    example_ja: '今日はとても [happy] です！😄',
    example_ko: '오늘 정말 [happy] 해요! 😄',
    example_it: 'Sono così [happy] oggi! 😄',
    example_es: '¡Estoy tan [happy] hoy! 😄',
    example_fr: 'Je suis si [happy] aujourd\'hui ! 😄',
    example_de: 'Ich bin heute so [happy]! 😄',
    example_pt: 'Estou tão [happy] hoje! 😄',
    example_ru: 'Я так [happy] сегодня! 😄'
  },
  '😠': {
    meaning: 'Angry - A red face with furrowed brows',
    meaning_ja: 'Angry - 眉をひそめた赤い顔',
    meaning_ko: 'Angry - 찌푸린 눈썹의 빨간 얼굴',
    meaning_it: 'Angry - Un viso rosso con sopracciglia aggrottate',
    meaning_es: 'Angry - Una cara roja con cejas fruncidas',
    meaning_fr: 'Angry - Un visage rouge avec des sourcils froncés',
    meaning_de: 'Angry - Ein rotes Gesicht mit gerunzelten Brauen',
    meaning_pt: 'Angry - Um rosto vermelho com sobrancelhas franzidas',
    meaning_ru: 'Angry - Красное лицо с нахмуренными бровями',
    usage: 'Used to convey anger or displeasure',
    usage_ja: '怒りや不快感を表すために使用',
    usage_ko: '분노나 불쾌감을 표현하기 위해 사용',
    usage_it: 'Usato per trasmettere rabbia o disapprovazione',
    usage_es: 'Usado para transmitir enojo o desagrado',
    usage_fr: 'Utilisé pour transmettre la colère ou le mécontentement',
    usage_de: 'Wird verwendet, um Wut oder Unzufriedenheit zu vermitteln',
    usage_pt: 'Usado para transmitir raiva ou desagrado',
    usage_ru: 'Используется для передачи гнева или недовольства',
    example: 'I\'m [angry] about this 😠',
    example_ja: 'これについて [angry] です 😠',
    example_ko: '이것에 대해 [angry] 해요 😠',
    example_it: 'Sono [angry] per questo 😠',
    example_es: 'Estoy [angry] por esto 😠',
    example_fr: 'Je suis [angry] à ce sujet 😠',
    example_de: 'Ich bin [angry] darüber 😠',
    example_pt: 'Estou [angry] com isso 😠',
    example_ru: 'Я [angry] из-за этого 😠'
  },
  '😢': {
    meaning: 'Cry - A blue face with tears streaming down',
    meaning_ja: 'Cry - 涙が流れる青い顔',
    meaning_ko: 'Cry - 눈물이 흐르는 파란 얼굴',
    meaning_it: 'Cry - Un viso blu con lacrime che scorrono',
    meaning_es: 'Cry - Una cara azul con lágrimas corriendo',
    meaning_fr: 'Cry - Un visage bleu avec des larmes qui coulent',
    meaning_de: 'Cry - Ein blaues Gesicht mit fließenden Tränen',
    meaning_pt: 'Cry - Um rosto azul com lágrimas escorrendo',
    meaning_ru: 'Cry - Синее лицо со струящимися слезами',
    usage: 'Representing sadness or emotional overwhelm',
    usage_ja: '悲しみや感情的な圧倒を表現',
    usage_ko: '슬픔이나 감정적 압도감을 표현',
    usage_it: 'Rappresentare tristezza o sopraffazione emotiva',
    usage_es: 'Representar tristeza o abrumación emocional',
    usage_fr: 'Représenter la tristesse ou la submersion émotionnelle',
    usage_de: 'Traurigkeit oder emotionale Überwältigung darstellen',
    usage_pt: 'Representar tristeza ou sobrecarga emocional',
    usage_ru: 'Представлять грусть или эмоциональную перегрузку',
    example: 'This made me [cry] 😢',
    example_ja: 'これで [cry] しました 😢',
    example_ko: '이것 때문에 [cry] 했어요 😢',
    example_it: 'Questo mi ha fatto [cry] 😢',
    example_es: 'Esto me hizo [cry] 😢',
    example_fr: 'Cela m\'a fait [cry] 😢',
    example_de: 'Das hat mich zum [cry] gebracht 😢',
    example_pt: 'Isso me fez [cry] 😢',
    example_ru: 'Это заставило меня [cry] 😢'
  },
  '😅': {
    meaning: 'Embarrassed/Awkward - A face with rosy cheeks and a shy smile',
    meaning_ja: 'Embarrassed/Awkward - 赤い頬と恥ずかしそうな笑顔',
    meaning_ko: 'Embarrassed/Awkward - 붉은 볼과 수줍은 미소',
    meaning_it: 'Embarrassed/Awkward - Un viso con guance rosse e un sorriso timido',
    meaning_es: 'Embarrassed/Awkward - Una cara con mejillas rosadas y una sonrisa tímida',
    meaning_fr: 'Embarrassed/Awkward - Un visage avec des joues roses et un sourire timide',
    meaning_de: 'Embarrassed/Awkward - Ein Gesicht mit rosigen Wangen und einem schüchternen Lächeln',
    meaning_pt: 'Embarrassed/Awkward - Um rosto com bochechas rosadas e um sorriso tímido',
    meaning_ru: 'Embarrassed/Awkward - Лицо с румяными щеками и застенчивой улыбкой',
    usage: 'Indicating embarrassment, shyness, or awkwardness',
    usage_ja: '恥ずかしさ、内気さ、または気まずさを示す',
    usage_ko: '당황, 수줍음, 또는 어색함을 나타냄',
    usage_it: 'Indicare imbarazzo, timidezza o goffaggine',
    usage_es: 'Indicar vergüenza, timidez o incomodidad',
    usage_fr: 'Indiquer l\'embarras, la timidité ou la gêne',
    usage_de: 'Verlegenheit, Schüchternheit oder Unbeholfenheit anzeigen',
    usage_pt: 'Indicar constrangimento, timidez ou desconforto',
    usage_ru: 'Указывать на смущение, застенчивость или неловкость',
    example: 'That was [embarrassed] 😅 or This is [awkward] 😅',
    example_ja: 'それは [embarrassed] でした 😅 またはこれは [awkward] です 😅',
    example_ko: '그것은 [embarrassed] 했어요 😅 또는 이것은 [awkward] 해요 😅',
    example_it: 'Quello era [embarrassed] 😅 o Questo è [awkward] 😅',
    example_es: 'Eso fue [embarrassed] 😅 o Esto es [awkward] 😅',
    example_fr: 'C\'était [embarrassed] 😅 ou C\'est [awkward] 😅',
    example_de: 'Das war [embarrassed] 😅 oder Das ist [awkward] 😅',
    example_pt: 'Isso foi [embarrassed] 😅 ou Isso é [awkward] 😅',
    example_ru: 'Это было [embarrassed] 😅 или Это [awkward] 😅'
  },
  '😲': {
    meaning: 'Surprised - A face with wide eyes and an open mouth',
    meaning_ja: 'Surprised - 大きく開いた目と口を開けた顔',
    meaning_ko: 'Surprised - 크게 뜬 눈과 벌어진 입',
    meaning_it: 'Surprised - Un viso con occhi spalancati e una bocca aperta',
    meaning_es: 'Surprised - Una cara con ojos muy abiertos y una boca abierta',
    meaning_fr: 'Surprised - Un visage avec des yeux écarquillés et une bouche ouverte',
    meaning_de: 'Surprised - Ein Gesicht mit weit aufgerissenen Augen und einem offenen Mund',
    meaning_pt: 'Surprised - Um rosto com olhos muito abertos e uma boca aberta',
    meaning_ru: 'Surprised - Лицо с широко открытыми глазами и открытым ртом',
    usage: 'Expressing shock or surprise',
    usage_ja: 'ショックや驚きを表現',
    usage_ko: '충격이나 놀라움을 표현',
    example: '[surprised] by the news! 😲',
    example_ja: 'ニュースに [surprised] しました！😲',
    example_ko: '뉴스에 [surprised] 했어요! 😲'
  },
  '🥺': {
    meaning: 'Wronged/Cute - A yellow face with sad eyes',
    meaning_ja: 'Wronged/Cute - 悲しい目をした黄色い顔',
    meaning_ko: 'Wronged/Cute - 슬픈 눈의 노란 얼굴',
    meaning_it: 'Wronged/Cute - Un viso giallo con occhi tristi',
    meaning_es: 'Wronged/Cute - Una cara amarilla con ojos tristes',
    meaning_fr: 'Wronged/Cute - Un visage jaune avec des yeux tristes',
    meaning_de: 'Wronged/Cute - Ein gelbes Gesicht mit traurigen Augen',
    meaning_pt: 'Wronged/Cute - Um rosto amarelo com olhos tristes',
    meaning_ru: 'Wronged/Cute - Желтое лицо с грустными глазами',
    usage: 'Indicating shyness, embarrassment, or cuteness',
    usage_ja: '内気さ、恥ずかしさ、または可愛らしさを示す',
    usage_ko: '수줍음, 당황, 또는 귀여움을 나타냄',
    usage_it: 'Indicare timidezza, imbarazzo o tenerezza',
    usage_es: 'Indicar timidez, vergüenza o ternura',
    usage_fr: 'Indiquer la timidité, l\'embarras ou la mignonnerie',
    usage_de: 'Schüchternheit, Verlegenheit oder Niedlichkeit anzeigen',
    usage_pt: 'Indicar timidez, constrangimento ou fofura',
    usage_ru: 'Указывать на застенчивость, смущение или миловидность',
    example: 'Please help me [cute] 🥺',
    example_ja: '助けてください [cute] 🥺',
    example_ko: '도와주세요 [cute] 🥺',
    example_it: 'Per favore aiutami [cute] 🥺',
    example_es: 'Por favor ayúdame [cute] 🥺',
    example_fr: 'S\'il te plaît aide-moi [cute] 🥺',
    example_de: 'Bitte hilf mir [cute] 🥺',
    example_pt: 'Por favor me ajude [cute] 🥺',
    example_ru: 'Пожалуйста, помоги мне [cute] 🥺'
  },
  '😤': {
    meaning: 'Shout/Sulk - A face with an open mouth or steam from nose',
    meaning_ja: 'Shout/Sulk - 口を開けた顔または鼻から蒸気',
    meaning_ko: 'Shout/Sulk - 벌어진 입 또는 코에서 나오는 증기',
    meaning_it: 'Shout/Sulk - Un viso con una bocca aperta o vapore dal naso',
    meaning_es: 'Shout/Sulk - Una cara con una boca abierta o vapor de la nariz',
    meaning_fr: 'Shout/Sulk - Un visage avec une bouche ouverte ou de la vapeur du nez',
    meaning_de: 'Shout/Sulk - Ein Gesicht mit offenem Mund oder Dampf aus der Nase',
    meaning_pt: 'Shout/Sulk - Um rosto com uma boca aberta ou vapor do nariz',
    meaning_ru: 'Shout/Sulk - Лицо с открытым ртом или паром из носа',
    usage: 'Expressing excitement, yelling, or being huffy',
    usage_ja: '興奮、叫び、または不機嫌を表現',
    usage_ko: '흥분, 외침, 또는 투정을 표현',
    usage_it: 'Esprimere eccitazione, urla o essere imbronciato',
    usage_es: 'Expresar emoción, gritos o estar de mal humor',
    usage_fr: 'Exprimer l\'excitation, les cris ou être boudeur',
    usage_de: 'Aufregung, Schreien oder Schmollen ausdrücken',
    usage_pt: 'Expressar emoção, gritos ou estar de mau humor',
    usage_ru: 'Выражать возбуждение, крики или обиду',
    example: 'I\'m not giving up [sulk] 😤',
    example_ja: '諦めません [sulk] 😤',
    example_ko: '포기하지 않아요 [sulk] 😤',
    example_it: 'Non mi arrendo [sulk] 😤',
    example_es: 'No me rindo [sulk] 😤',
    example_fr: 'Je n\'abandonne pas [sulk] 😤',
    example_de: 'Ich gebe nicht auf [sulk] 😤',
    example_pt: 'Não vou desistir [sulk] 😤',
    example_ru: 'Я не сдаюсь [sulk] 😤'
  },
  '😳': {
    meaning: 'Flushed - A face with red cheeks',
    meaning_ja: 'Flushed - 赤い頬の顔',
    meaning_ko: 'Flushed - 붉은 볼의 얼굴',
    meaning_it: 'Flushed - Un viso con guance rosse',
    meaning_es: 'Flushed - Una cara con mejillas rojas',
    meaning_fr: 'Flushed - Un visage avec des joues rouges',
    meaning_de: 'Flushed - Ein Gesicht mit roten Wangen',
    meaning_pt: 'Flushed - Um rosto com bochechas vermelhas',
    meaning_ru: 'Flushed - Лицо с красными щеками',
    usage: 'Indicating embarrassment or shyness',
    usage_ja: '恥ずかしさや内気さを示す',
    usage_ko: '당황이나 수줍음을 나타냄',
    usage_it: 'Indicare imbarazzo o timidezza',
    usage_es: 'Indicar vergüenza o timidez',
    usage_fr: 'Indiquer l\'embarras ou la timidité',
    usage_de: 'Verlegenheit oder Schüchternheit anzeigen',
    usage_pt: 'Indicar constrangimento ou timidez',
    usage_ru: 'Указывать на смущение или застенчивость',
    example: 'That was [flushed] 😳',
    example_ja: 'それは [flushed] でした 😳',
    example_ko: '그것은 [flushed] 했어요 😳',
    example_it: 'Quello era [flushed] 😳',
    example_es: 'Eso fue [flushed] 😳',
    example_fr: 'C\'était [flushed] 😳',
    example_de: 'Das war [flushed] 😳',
    example_pt: 'Isso foi [flushed] 😳',
    example_ru: 'Это было [flushed] 😳'
  },
  '😋': {
    meaning: 'Yummy - A face licking its lips',
    meaning_ja: 'Yummy - 唇を舐める顔',
    meaning_ko: 'Yummy - 입술을 핥는 얼굴',
    meaning_it: 'Yummy - Un viso che si lecca le labbra',
    meaning_es: 'Yummy - Una cara lamiéndose los labios',
    meaning_fr: 'Yummy - Un visage qui se lèche les lèvres',
    meaning_de: 'Yummy - Ein Gesicht, das sich die Lippen leckt',
    meaning_pt: 'Yummy - Um rosto lambendo os lábios',
    meaning_ru: 'Yummy - Лицо, облизывающее губы',
    usage: 'Expressing deliciousness or craving for food',
    usage_ja: '美味しさや食べ物への渇望を表現',
    usage_ko: '맛있음이나 음식에 대한 갈망을 표현',
    usage_it: 'Esprimere deliziosità o brama di cibo',
    usage_es: 'Expresar deliciosidad o antojo de comida',
    usage_fr: 'Exprimer la délicatesse ou l\'envie de nourriture',
    usage_de: 'Köstlichkeit oder Heißhunger auf Essen ausdrücken',
    usage_pt: 'Expressar deliciosidade ou desejo por comida',
    usage_ru: 'Выражать вкусность или тягу к еде',
    example: 'This food is [yummy] 😋',
    example_ja: 'この食べ物は [yummy] です 😋',
    example_ko: '이 음식은 [yummy] 해요 😋',
    example_it: 'Questo cibo è [yummy] 😋',
    example_es: 'Esta comida está [yummy] 😋',
    example_fr: 'Cette nourriture est [yummy] 😋',
    example_de: 'Dieses Essen ist [yummy] 😋',
    example_pt: 'Esta comida está [yummy] 😋',
    example_ru: 'Эта еда [yummy] 😋'
  },
  '😌': {
    meaning: 'Complacent - A smug face with a self-satisfied smile',
    meaning_ja: 'Complacent - 自己満足の笑顔の独善的な顔',
    meaning_ko: 'Complacent - 자기만족스러운 미소의 교만한 얼굴',
    meaning_it: 'Complacent - Un viso compiaciuto con un sorriso soddisfatto',
    meaning_es: 'Complacent - Una cara presumida con una sonrisa autosatisfecha',
    meaning_fr: 'Complacent - Un visage suffisant avec un sourire satisfait',
    meaning_de: 'Complacent - Ein selbstgefälliges Gesicht mit einem selbstzufriedenen Lächeln',
    meaning_pt: 'Complacent - Um rosto presunçoso com um sorriso autossatisfeito',
    meaning_ru: 'Complacent - Самодовольное лицо с самодовольной улыбкой',
    usage: 'Indicating complacency or satisfaction',
    usage_ja: '自己満足や満足を示す',
    usage_ko: '자만심이나 만족을 나타냄',
    usage_it: 'Indicare compiacimento o soddisfazione',
    usage_es: 'Indicar complacencia o satisfacción',
    usage_fr: 'Indiquer la complaisance ou la satisfaction',
    usage_de: 'Selbstgefälligkeit oder Zufriedenheit anzeigen',
    usage_pt: 'Indicar complacência ou satisfação',
    usage_ru: 'Указывать на самодовольство или удовлетворение',
    example: 'I feel [complacent] 😌',
    example_ja: '私は [complacent] を感じます 😌',
    example_ko: '나는 [complacent] 을 느껴요 😌',
    example_it: 'Mi sento [complacent] 😌',
    example_es: 'Me siento [complacent] 😌',
    example_fr: 'Je me sens [complacent] 😌',
    example_de: 'Ich fühle mich [complacent] 😌',
    example_pt: 'Eu me sinto [complacent] 😌',
    example_ru: 'Я чувствую себя [complacent] 😌'
  },
  '🤤': {
    meaning: 'Drool - A face with drool coming out of its mouth',
    meaning_ja: 'Drool - 口からよだれが出る顔',
    meaning_ko: 'Drool - 입에서 침이 흐르는 얼굴',
    meaning_it: 'Drool - Un viso con la bava che esce dalla bocca',
    meaning_es: 'Drool - Una cara con baba saliendo de la boca',
    meaning_fr: 'Drool - Un visage avec de la bave qui sort de la bouche',
    meaning_de: 'Drool - Ein Gesicht mit Sabber, der aus dem Mund läuft',
    meaning_pt: 'Drool - Um rosto com baba saindo da boca',
    meaning_ru: 'Drool - Лицо с слюной, вытекающей изо рта',
    usage: 'Indicating hunger or desire',
    usage_ja: '空腹や欲望を示す',
    usage_ko: '배고픔이나 욕망을 나타냄',
    usage_it: 'Indicare fame o desiderio',
    usage_es: 'Indicar hambre o deseo',
    usage_fr: 'Indiquer la faim ou le désir',
    usage_de: 'Hunger oder Verlangen anzeigen',
    usage_pt: 'Indicar fome ou desejo',
    usage_ru: 'Указывать на голод или желание',
    example: 'I\'m [drool] for that food 🤤',
    example_ja: 'その食べ物に [drool] しています 🤤',
    example_ko: '그 음식에 [drool] 하고 있어요 🤤',
    example_it: 'Sto [drool] per quel cibo 🤤',
    example_es: 'Estoy [drool] por esa comida 🤤',
    example_fr: 'Je [drool] pour cette nourriture 🤤',
    example_de: 'Ich [drool] für dieses Essen 🤤',
    example_pt: 'Estou [drool] por essa comida 🤤',
    example_ru: 'Я [drool] за эту еду 🤤'
  },
  '😱': {
    meaning: 'Scream/Astonish/Shock - A face with wide eyes and an open mouth',
    meaning_ja: 'Scream/Astonish/Shock - 大きく開いた目と口を開けた顔',
    meaning_ko: 'Scream/Astonish/Shock - 크게 뜬 눈과 벌어진 입',
    meaning_it: 'Scream/Astonish/Shock - Un viso con occhi spalancati e una bocca aperta',
    meaning_es: 'Scream/Astonish/Shock - Una cara con ojos muy abiertos y una boca abierta',
    meaning_fr: 'Scream/Astonish/Shock - Un visage avec des yeux écarquillés et une bouche ouverte',
    meaning_de: 'Scream/Astonish/Shock - Ein Gesicht mit weit aufgerissenen Augen und einem offenen Mund',
    meaning_pt: 'Scream/Astonish/Shock - Um rosto com olhos muito abertos e uma boca aberta',
    meaning_ru: 'Scream/Astonish/Shock - Лицо с широко открытыми глазами и открытым ртом',
    usage: 'Expressing fear, shock, or extreme surprise',
    usage_ja: '恐怖、ショック、または極度の驚きを表現',
    usage_ko: '두려움, 충격, 또는 극도의 놀라움을 표현',
    usage_it: 'Esprimere paura, shock o sorpresa estrema',
    usage_es: 'Expresar miedo, shock o sorpresa extrema',
    usage_fr: 'Exprimer la peur, le choc ou la surprise extrême',
    usage_de: 'Angst, Schock oder extreme Überraschung ausdrücken',
    usage_pt: 'Expressar medo, choque ou surpresa extrema',
    usage_ru: 'Выражать страх, шок или крайнее удивление',
    example: 'I can\'t believe it [scream] 😱',
    example_ja: '信じられません [scream] 😱',
    example_ko: '믿을 수 없어요 [scream] 😱',
    example_it: 'Non posso crederci [scream] 😱',
    example_es: 'No puedo creerlo [scream] 😱',
    example_fr: 'Je n\'arrive pas à y croire [scream] 😱',
    example_de: 'Ich kann es nicht glauben [scream] 😱',
    example_pt: 'Não posso acreditar [scream] 😱',
    example_ru: 'Я не могу в это поверить [scream] 😱'
  },
  '😭': {
    meaning: 'Weep - A face with tears',
    meaning_ja: 'Weep - 涙の顔',
    meaning_ko: 'Weep - 눈물의 얼굴',
    meaning_it: 'Weep - Un viso con lacrime',
    meaning_es: 'Weep - Una cara con lágrimas',
    meaning_fr: 'Weep - Un visage avec des larmes',
    meaning_de: 'Weep - Ein Gesicht mit Tränen',
    meaning_pt: 'Weep - Um rosto com lágrimas',
    meaning_ru: 'Weep - Лицо со слезами',
    usage: 'Indicating deep sadness or sorrow',
    usage_ja: '深い悲しみや悲嘆を示す',
    usage_ko: '깊은 슬픔이나 비통함을 나타냄',
    usage_it: 'Indicare profonda tristezza o dolore',
    usage_es: 'Indicar profunda tristeza o dolor',
    usage_fr: 'Indiquer une profonde tristesse ou douleur',
    usage_de: 'Tiefe Traurigkeit oder Kummer anzeigen',
    usage_pt: 'Indicar profunda tristeza ou dor',
    usage_ru: 'Указывать на глубокую грусть или скорбь',
    example: 'This is so sad [weep] 😭',
    example_ja: 'これはとても悲しい [weep] 😭',
    example_ko: '이것은 너무 슬퍼요 [weep] 😭',
    example_it: 'Questo è così triste [weep] 😭',
    example_es: 'Esto es tan triste [weep] 😭',
    example_fr: 'C\'est si triste [weep] 😭',
    example_de: 'Das ist so traurig [weep] 😭',
    example_pt: 'Isso é tão triste [weep] 😭',
    example_ru: 'Это так грустно [weep] 😭'
  },
  '😶': {
    meaning: 'Speechless - A face with a hand over its mouth',
    meaning_ja: 'Speechless - 口に手を当てた顔',
    meaning_ko: 'Speechless - 입에 손을 대고 있는 얼굴',
    meaning_it: 'Speechless - Un viso con una mano sulla bocca',
    meaning_es: 'Speechless - Una cara con una mano sobre la boca',
    meaning_fr: 'Speechless - Un visage avec une main sur la bouche',
    meaning_de: 'Speechless - Ein Gesicht mit einer Hand über dem Mund',
    meaning_pt: 'Speechless - Um rosto com uma mão sobre a boca',
    meaning_ru: 'Speechless - Лицо с рукой на рту',
    usage: 'Indicating shock or being speechless',
    usage_ja: 'ショックや言葉を失うことを示す',
    usage_ko: '충격이나 말을 잃은 상태를 나타냄',
    usage_it: 'Indicare shock o essere senza parole',
    usage_es: 'Indicar shock o estar sin palabras',
    usage_fr: 'Indiquer le choc ou être sans voix',
    usage_de: 'Schock oder Sprachlosigkeit anzeigen',
    usage_pt: 'Indicar choque ou estar sem palavras',
    usage_ru: 'Указывать на шок или потерю дара речи',
    example: 'I\'m [speechless] 😶',
    example_ja: '私は [speechless] です 😶',
    example_ko: '나는 [speechless] 해요 😶',
    example_it: 'Sono [speechless] 😶',
    example_es: 'Estoy [speechless] 😶',
    example_fr: 'Je suis [speechless] 😶',
    example_de: 'Ich bin [speechless] 😶',
    example_pt: 'Estou [speechless] 😶',
    example_ru: 'Я [speechless] 😶'
  },
  '😜': {
    meaning: 'Funnyface - A silly face with exaggerated features',
    meaning_ja: 'Funnyface - 誇張された特徴を持つ愚かな顔',
    meaning_ko: 'Funnyface - 과장된 특징을 가진 바보 같은 얼굴',
    meaning_it: 'Funnyface - Un viso sciocco con caratteristiche esagerate',
    meaning_es: 'Funnyface - Una cara tonta con características exageradas',
    meaning_fr: 'Funnyface - Un visage idiot avec des traits exagérés',
    meaning_de: 'Funnyface - Ein albernes Gesicht mit übertriebenen Zügen',
    meaning_pt: 'Funnyface - Um rosto bobo com características exageradas',
    meaning_ru: 'Funnyface - Глупое лицо с преувеличенными чертами',
    usage: 'Used to indicate humor or silliness',
    usage_ja: 'ユーモアや愚かさを示すために使用',
    usage_ko: '유머나 어리석음을 나타내기 위해 사용',
    usage_it: 'Usato per indicare umorismo o sciocchezza',
    usage_es: 'Usado para indicar humor o tontería',
    usage_fr: 'Utilisé pour indiquer l\'humour ou la bêtise',
    usage_de: 'Wird verwendet, um Humor oder Albernheit anzuzeigen',
    usage_pt: 'Usado para indicar humor ou bobagem',
    usage_ru: 'Используется для указания юмора или глупости',
    example: 'That was [funnyface] 😜',
    example_ja: 'それは [funnyface] でした 😜',
    example_ko: '그것은 [funnyface] 했어요 😜',
    example_it: 'Quello era [funnyface] 😜',
    example_es: 'Eso fue [funnyface] 😜',
    example_fr: 'C\'était [funnyface] 😜',
    example_de: 'Das war [funnyface] 😜',
    example_pt: 'Isso foi [funnyface] 😜',
    example_ru: 'Это было [funnyface] 😜'
  },
  '😂': {
    meaning: 'Laughwithtears/Laugh - A face laughing with tears streaming down',
    meaning_ja: 'Laughwithtears/Laugh - 涙を流しながら笑う顔',
    meaning_ko: 'Laughwithtears/Laugh - 눈물을 흘리며 웃는 얼굴',
    meaning_it: 'Laughwithtears/Laugh - Un viso che ride con lacrime che scorrono',
    meaning_es: 'Laughwithtears/Laugh - Una cara riendo con lágrimas corriendo',
    meaning_fr: 'Laughwithtears/Laugh - Un visage qui rit avec des larmes qui coulent',
    meaning_de: 'Laughwithtears/Laugh - Ein Gesicht, das lacht mit fließenden Tränen',
    meaning_pt: 'Laughwithtears/Laugh - Um rosto rindo com lágrimas escorrendo',
    meaning_ru: 'Laughwithtears/Laugh - Лицо, смеющееся со струящимися слезами',
    usage: 'Indicating extreme laughter or joy',
    usage_ja: '極度の笑いや喜びを示す',
    usage_ko: '극도의 웃음이나 기쁨을 나타냄',
    usage_it: 'Indicare risate estreme o gioia',
    usage_es: 'Indicar risa extrema o alegría',
    usage_fr: 'Indiquer un rire extrême ou une joie',
    usage_de: 'Extremes Lachen oder Freude anzeigen',
    usage_pt: 'Indicar riso extremo ou alegria',
    usage_ru: 'Указывать на крайний смех или радость',
    example: 'This is hilarious [laugh] 😂',
    example_ja: 'これは面白い [laugh] 😂',
    example_ko: '이것은 정말 웃겨요 [laugh] 😂',
    example_it: 'Questo è esilarante [laugh] 😂',
    example_es: 'Esto es hilarante [laugh] 😂',
    example_fr: 'C\'est hilarant [laugh] 😂',
    example_de: 'Das ist urkomisch [laugh] 😂',
    example_pt: 'Isso é hilariante [laugh] 😂',
    example_ru: 'Это уморительно [laugh] 😂'
  },
  '😈': {
    meaning: 'Wicked/Evil - A mischievous face with a sly smile',
    meaning_ja: 'Wicked/Evil - ずる賢い笑顔のいたずらな顔',
    meaning_ko: 'Wicked/Evil - 교활한 미소의 장난스러운 얼굴',
    meaning_it: 'Wicked/Evil - Un viso birichino con un sorriso furbo',
    meaning_es: 'Wicked/Evil - Una cara traviesa con una sonrisa astuta',
    meaning_fr: 'Wicked/Evil - Un visage espiègle avec un sourire rusé',
    meaning_de: 'Wicked/Evil - Ein schelmisches Gesicht mit einem schlauen Lächeln',
    meaning_pt: 'Wicked/Evil - Um rosto travesso com um sorriso astuto',
    meaning_ru: 'Wicked/Evil - Озорное лицо с хитрым улыбкой',
    usage: 'Indicating wickedness, playfulness, or evil intent',
    usage_ja: '邪悪さ、遊び心、または悪意を示す',
    usage_ko: '사악함, 장난스러움, 또는 악의를 나타냄',
    usage_it: 'Indicare malvagità, giocosità o intento malvagio',
    usage_es: 'Indicar maldad, travieso o intención malvada',
    usage_fr: 'Indiquer la méchanceté, l\'espièglerie ou l\'intention maléfique',
    usage_de: 'Boshaftigkeit, Verspieltheit oder böse Absicht anzeigen',
    usage_pt: 'Indicar maldade, travessura ou intenção malvada',
    usage_ru: 'Указывать на злобу, озорство или злой умысел',
    example: 'I have an [evil] plan 😈',
    example_ja: '私は [evil] な計画を持っています 😈',
    example_ko: '나는 [evil] 계획이 있어요 😈',
    example_it: 'Ho un piano [evil] 😈',
    example_es: 'Tengo un plan [evil] 😈',
    example_fr: 'J\'ai un plan [evil] 😈',
    example_de: 'Ich habe einen [evil] Plan 😈',
    example_pt: 'Tenho um plano [evil] 😈',
    example_ru: 'У меня есть [evil] план 😈'
  },
  '🙄': {
    meaning: 'Facewithrollingeyes - A face rolling its eyes',
    meaning_ja: 'Facewithrollingeyes - 目を回す顔',
    usage: 'Indicating annoyance or disbelief',
    usage_ja: 'イライラや不信を示す',
    example: 'Really? [facewithrollingeyes] 🙄',
    example_ja: '本当に？[facewithrollingeyes] 🙄'
  },
  '🤔': {
    meaning: 'Thinking - A face with a hand on its chin',
    meaning_ja: 'Thinking - 顎に手を当てた顔',
    usage: 'Indicating deep thought or contemplation',
    usage_ja: '深い思考や熟考を示す',
    example: 'Let me think about that [thinking] 🤔',
    example_ja: 'それについて考えさせてください [thinking] 🤔'
  },
  '🥰': {
    meaning: 'Lovely/Loveface - A face with hearts in its eyes',
    meaning_ja: 'Lovely/Loveface - 目にハートがある顔',
    usage: 'Indicating love, admiration, or extreme happiness',
    usage_ja: '愛、憧れ、または極度の幸せを示す',
    example: 'This is so [lovely] 🥰',
    example_ja: 'これはとても [lovely] です 🥰'
  },
  '🤑': {
    meaning: 'Greedy - A face with a greedy smile',
    meaning_ja: 'Greedy - 貪欲な笑顔の顔',
    usage: 'Indicating greed or desire for more',
    usage_ja: '貪欲さやより多くの欲望を示す',
    example: 'Show me the money [greedy] 🤑',
    example_ja: 'お金を見せて [greedy] 🤑'
  },
  '😮': {
    meaning: 'Wow - A face with wide eyes and an open mouth',
    meaning_ja: 'Wow - 大きく開いた目と口を開けた顔',
    usage: 'Expressing amazement or wonder',
    usage_ja: '驚きや不思議を表現',
    example: '[wow] that\'s incredible! 😮',
    example_ja: '[wow] それは信じられません！😮'
  },
  '😆': {
    meaning: 'Joyful - A face with a big smile and sparkling eyes',
    meaning_ja: 'Joyful - 大きな笑顔とキラキラした目',
    usage: 'Indicating joy or happiness',
    usage_ja: '喜びや幸せを示す',
    example: 'I\'m so [joyful] right now! 😆',
    example_ja: '今とても [joyful] です！😆'
  },
  '🤚': {
    meaning: 'Slap - A face with a hand raised',
    meaning_ja: 'Slap - 手を上げた顔',
    usage: 'Indicating a slap or playful hit',
    usage_ja: '平手打ちや遊びの打撃を示す',
    example: 'Stop right there [slap] 🤚',
    example_ja: 'そこで止まって [slap] 🤚'
  },
  '💧': {
    meaning: 'Tears - A face with tears',
    meaning_ja: 'Tears - 涙の顔',
    usage: 'Indicating sadness or emotional release',
    usage_ja: '悲しみや感情的な解放を示す',
    example: 'This made me [tears] 💧',
    example_ja: 'これで [tears] しました 💧'
  },
  '😵': {
    meaning: 'Stun - A face with a shocked expression',
    meaning_ja: 'Stun - ショックを受けた表情の顔',
    usage: 'Indicating being stunned or shocked',
    usage_ja: 'ショックを受けたことを示す',
    example: 'I\'m [stun] by that news 😵',
    example_ja: 'そのニュースに [stun] しました 😵'
  }
};

// 抖音热门表情列表 - 基于alltiktokemojis.com官方数据
export const DOUYIN_POPULAR_EMOJIS = [
  '[smile]', '[cool]', '[wicked]', '[proud]', '[flushed]', '[cry]',  // 最受欢迎的6个表情
  '[lovely]', '[greedy]', '[wow]', '[joyful]', '[hehe]', '[slap]', '[tears]', '[stun]', '[cute]', '[blink]',
  '[disdain]', '[scream]', '[rage]', '[excited]', '[angel]', '[laugh]', '[pride]', '[nap]', '[facewithrollingeyes]', '[thinking]'
];

// 抖音表情分类 - 使用抖音表情短代码
export const DOUYIN_CATEGORIES = {
  reactions: ['[scream]', '[surprised]', '[stun]', '[shock]', '[rage]', '[disdain]'],      // 反应表情
  emotions: ['[lovely]', '[greedy]', '[wow]', '[joyful]', '[hehe]', '[cry]'],      // 情感表情
  actions: ['[slap]', '[blink]', '[proud]', '[cool]', '[nap]'],             // 动作表情
  emphasis: ['[excited]', '[smile]', '[evil]', '[angel]'],                  // 强调表情
  special: ['[greedy]', '[tears]', '[hehe]', '[happy]', '[cry]']              // 特殊表情
};

// 解析抖音短代码
export function parseDouyinShortcodes(text: string): string {
  let result = text;
  
  // 替换短代码
  Object.entries(DOUYIN_SHORTCODES).forEach(([shortcode, emoji]) => {
    result = result.replace(new RegExp(shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emoji);
  });
  
  return result;
}

// 生成抖音风格的表情组合
export function generateDouyinStyle(text: string): string {
  const words = text.toLowerCase().split(' ');
  let result = text;
  
  // 根据关键词添加表情
  if (words.some(word => ['amazing', 'wow', 'incredible'].includes(word))) {
    result += ' 😱💯🔥✨';
  } else if (words.some(word => ['cant', 'even', 'understand'].includes(word))) {
    result += ' 😵‍💫🤯💀';
  } else if (words.some(word => ['perfect', 'everything', 'love'].includes(word))) {
    result += ' 👏🎉💖✨';
  } else if (words.some(word => ['speechless', 'words', 'needed'].includes(word))) {
    result += ' 🤐😶💭';
  } else if (words.some(word => ['living', 'excited', 'love'].includes(word))) {
    result += ' 💃🕺🎊';
  } else if (words.some(word => ['content', 'signed', 'up'].includes(word))) {
    result += ' 📝✅💯';
  }
  
  return result;
}

// 获取抖音表情含义
export function getDouyinMeaning(emoji: string): string | null {
  return DOUYIN_MEANINGS[emoji as keyof typeof DOUYIN_MEANINGS]?.meaning ?? null;
}

// 获取抖音表情示例
export function getDouyinExample(emoji: string): string | null {
  return DOUYIN_MEANINGS[emoji as keyof typeof DOUYIN_MEANINGS]?.example ?? null;
}

// 检查是否为抖音热门表情
export function isDouyinPopular(emoji: string): boolean {
  return DOUYIN_POPULAR_EMOJIS.includes(emoji);
} 