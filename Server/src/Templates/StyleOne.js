export const generateHtml = (title, author, sections) => {
  return `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            line-height: 1.6;
            font-size: 11pt;
            color: #2d3748;
            background: #ffffff;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 50px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          h1 {
            font-size: 32pt;
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
          }
          
          .author {
            font-size: 14pt;
            color: #718096;
            font-weight: 400;
            font-style: italic;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          h2 {
            font-size: 18pt;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid #4a90e2;
            position: relative;
          }
          
          h2:before {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 60px;
            height: 2px;
            background: #e53e3e;
          }
          
          .content-block {
            margin-bottom: 25px;
          }
          
          p {
            margin-bottom: 16px;
            text-align: justify;
            font-weight: 400;
          }
          
          a {
            color: #3182ce;
            text-decoration: none;
            border-bottom: 1px solid #bee3f8;
            transition: all 0.2s ease;
            font-weight: 500;
          }
          
          a:hover {
            color: #2c5aa0;
            border-bottom-color: #3182ce;
          }
          
          ul {
            margin: 15px 0 25px 30px;
            list-style: none;
          }
          
          li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            font-weight: 400;
          }
          
          li:before {
            content: '•';
            color: #4a90e2;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          .list-link {
            background: #f7fafc;
            border-left: 3px solid #4a90e2;
            padding: 12px 15px;
            margin: 8px 0;
            border-radius: 0 4px 4px 0;
          }
          
          .list-link a {
            border-bottom: none;
            color: #2b6cb0;
          }
          
          .footer {
            text-align: center;
            font-size: 10pt;
            color: #a0aec0;
            margin-top: 80px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-heart {
            color: #e53e3e;
            font-weight: bold;
          }
          
          .metadata {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin: 25px 0;
            font-size: 10pt;
            color: #718096;
          }
          
          .page-number {
            position: absolute;
            bottom: 30px;
            right: 50px;
            font-size: 9pt;
            color: #cbd5e0;
          }
          
          .code-block {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p class="author">By ${author}</p>
            
            <div class="metadata">
              Generated on ${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} • ${sections.length} sections
            </div>
          </div>

          ${sections
            .map((section, index) => {
            
              const contentArray = Array.isArray(section.content)
                ? section.content
                : [section.content];

              return `
                <div class="section">
                  <h2><span class="section-number">${(index + 1)
                    .toString()
                    .padStart(2, "0")}.</span> ${section.heading}</h2>
                  
                  <div class="content">
                    ${contentArray
                      .map((item) => {
                        if (typeof item === "string") {
                          const htmlString = item.replace(
                            /(https?:\/\/[^\s]+)/g,
                            '<a href="$1" target="_blank">$1</a>'
                          );
                          return `<div class="content-block"><p>${htmlString}</p></div>`;
                        } else if (Array.isArray(item)) {
                          return `<div class="content-block">
                            <ul>${item
                              .map((i) =>
                                i.match(/^https?:\/\//)
                                  ? `<li class="list-link"><a href="${i}" target="_blank">${i}</a></li>`
                                  : `<li>${i}</li>`
                              )
                              .join("")}
                            </ul>
                          </div>`;
                        }
                      })
                      .join("")}
                  </div>
                </div>
              `;
            })
            .join("")}

          <div class="footer">
            <p>Generated with <span class="footer-heart">❤️</span> by LUMO • Professional PDF Tool</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
