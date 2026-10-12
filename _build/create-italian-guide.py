"""Build the Italian downloadable guide from the actual app articles."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/share/fonts/DejaVuSans.ttf'
pdfmetrics.registerFont(TTFont('Guide', str(FONT)))
articles = {a['id']: a for section in json.loads((ROOT / '_build/content/it/knowledge.json').read_text(encoding='utf-8')) for a in section['articles']}
slugs = json.loads((ROOT / '_build/content/slugs.json').read_text(encoding='utf-8'))['it']['articles']
out = ROOT / 'assets/guides/guida-desiderio-it.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(out), pagesize=(595.28, 841.89))
c.setTitle('Affrontare la voglia di fumare | Sigara Savar')
c.setAuthor('Sigara Savar')
ink, green = HexColor('#183C30'), HexColor('#147451')
styles = {name: ParagraphStyle(name, fontName='Guide', fontSize=size, leading=leading, textColor=ink) for name, size, leading in [('title',25,32),('heading',13,20),('body',10.5,16),('small',8,12)]}
def para(text, style='body', gap=12):
    global y
    p = Paragraph(escape(text), styles[style])
    _, height = p.wrap(491, 740)
    assert y-height > 72, 'Guide content would overlap the footer'
    p.drawOn(c,52,y-height)
    y -= height+gap

for page, article_id in enumerate(['b3-02','b3-04'],1):
    article = articles[article_id]
    c.setFillColor(HexColor('#43C682'));c.rect(0,823.89,595.28,18,fill=1,stroke=0)
    c.setFillColor(green);c.setFont('Guide',10);c.drawString(52,787,'SIGARA SAVAR  /  CENTRO INFORMAZIONI')
    y=750
    para('Affrontare la voglia di fumare' if page==1 else 'Il metodo 4D', 'title',20)
    para(article['intro'],gap=22)
    for section in article['contentSections']:
        if section['body']:
            para(section['title'],'heading',5);para(section['body'],gap=18)
        for number,item in enumerate(section['items'],1):
            title, body = item.split(': ',1)
            para(f'{number}. {title}','heading',5);para(body,gap=16)
    for item in article['keyTakeaways']:para(item,gap=18)
    para('Informazioni generali, non una consulenza medica. Per dubbi sulla tua salute, rivolgiti a un professionista sanitario. Interrompi gli esercizi di respirazione se avverti capogiri, dolore o difficoltà a respirare.','small')
    url='https://www.sigarasavar.com/it/centro-informazioni/'+slugs[article_id]+'/'
    c.setFillColor(green);c.setFont('Guide',9);c.drawString(52,52,'Leggi l’articolo completo su sigarasavar.com')
    c.linkURL(url,(52,48,360,65),relative=0)
    c.drawRightString(543,52,f'{page} / 2')
    c.showPage()
c.save()
print('Created Italian guide: 2 pages, app articles b3-02 and b3-04.')
