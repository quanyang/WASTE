//payload[0] = category
//payload[1] = Name of scan
//payload[2] = id of scan
//payload[3] = attack parameter
//  payload[3][i][0] = fields to target ( * = everything )
//  payload[3][i][1] = payload to inject.
//payload[4] = signature to detect ( differential detection : @save[1] and @compare[1] )  
//SQL - regex
//
//XSS: [["*","<div id='w1232' href='w1232' src='w1232'></div>"]],
//["@XSS,w1232,href,src"]
//signature : ["@XSS,w1232,href,src"] means @XSS is to indicate XSS w1232 is id.
//what follows are the attributes you want the system to check. value is ignored.
//
//XSRF - token/captcha
//



var payload = [ 
    ["sql", "Test for vulnerability", "sql1",
     [["*","';--"],["*","'--"]],
     ["An error occured: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to","error"]
    ],
    ["sql", "Login Field","sql2",
     [["^.*username.*$","' or '1' = '1"]]
    ],
    ["xss", "Test for vulnerability","xss1",
     [["*","<div id='w1231' href='w1231' src='w1231'></div>"]],
     ["@XSS,w1231,href,src"]
    ],
    ["xss", "Insert Image","xss2",
     [["*","<IMG id=w1232 src=w1232> "]],
     ["@XSS,w1232,src"]
    ],
    ["xss", "Insert Script","xss3",
     [["*","<script id=w1233 src=w1233>"]],
     ["@XSS,w1233,src"]
    ],
    ["xss", "Insert IFRAME","xss4",
     [["*","<iframe id=w1234 src=w1234 onload=w1234 onmouseover=w1234>"]],
     ["@XSS,w1234,src,onload,onmouseover"]
    ],
    ["xss", "Insert IFRAME (Open ended tag)","xss5",
     [["*","<iframe id=w1235 src=w1234 onload=w1235 onmouseover=w1235"]],
     ["@XSS,w1235,src,onload,onmouseover"]
    ],
    ["xss", "Insert BODY","xss6",
     [["*","<body id=w1236 background=w1236 onload=w1236>"]],
     ["@XSS,w1236,background,onload"]
    ],
    ["xss", "Insert LINK Stylesheet","xss7",
     [["*","<link id=w1237 rel=stylesheet href=w1237>"]],
     ["@XSS,w1237,rel,href"]
    ],
    ["xsrf", "Test for vulnerability", "xsrf1",
     [["*",""]],
     ["@XSRF,compare","@XSRF,tokencaptcha"]]

];
