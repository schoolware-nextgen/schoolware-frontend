FROM httpd:2.4
 
COPY ./dist /usr/local/apache2/htdocs/
COPY web/.htaccess /usr/local/apache2/htdocs/.htaccess
COPY web/httpd.conf /usr/local/apache2/conf/httpd.conf