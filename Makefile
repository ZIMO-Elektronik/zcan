all:
	@#@for f in $$(grep -lrw src/ --include "*.ts" -Pe "[ \t]+from[ \t]+['\"]src\/"); do
	@for f in $$(find src -type f -name "*.ts"); do \
		n=$$(grep -cP "[ \t]+from[ \t]+['\"]src\/" "$$f"); \
		if [ $$n -eq 0 ]; then continue; fi; \
		dir=''; \
		for i in $$(seq 0 $$(echo "$$f" | tr -dc ',' | wc -c)); do \
			dir="..\/$$dir"; \
		done; \
		if [ -z $$dir ]; then dir='.\/'; fi; \
		echo -n "\nmaking import paths relative @ $$f ... "; \
		sed -i -E "/\sfrom\s+['\"]/ s/([^\/])src\//\1$$dir/g" "$$f"; \
		n=$$(grep -cP "[ \t]+from[ \t]+['\"]src\/" "$$f"); \
		if [ $$n -eq 0 ]; then \
			echo "done"; \
		else \
			echo "failed"; \
		fi; \
	done; \
	npm run build
	yalc push || true
