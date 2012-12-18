NAME := tabsanity-extension

zip:
	rm -fr export
	mkdir export
	git archive --prefix=$(NAME)/ -v --format zip HEAD > export/$(NAME).zip
	cd export && unzip -o $(NAME).zip
	rm export/$(NAME).zip
	rm -fr export/$(NAME)/PRIVATE-KEY \
            export/$(NAME)/Makefile \
            export/$(NAME)/.gitignore \
            export/$(NAME)/bin
	cd export && zip -qr -9 -X $(NAME) $(NAME)

crx: zip
	cd export && ../bin/create-crx.sh $(NAME) ../PRIVATE-KEY

dist: crx
	./bin/upload-crx.py export/$(NAME).crx
	./bin/upload-update-manifest.py < export/$(NAME)/manifest.json

clean:
	find . -name '*~' | xargs -r rm
	rm -fr export
