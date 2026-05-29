// ===== Smooth Scroll for Anchor Links =====
    // Purpose: Makes the "Request Service" button and other internal links feel polished.
    // Triggers: When a same-page anchor is clicked.
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

(function() {
      var endpoint = document.querySelector('meta[name="sheet-data-url"]')?.content;
      if (!endpoint) return;
      var container = document.getElementById('sheet-data');
      var errorDiv = document.getElementById('menu-error');
      fetch(endpoint)
        .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function(result) {
          if (!container || !result.data || result.data.length === 0) {
            if (errorDiv) errorDiv.classList.remove('hidden');
            return;
          }
          var imageKeys = ['Image URL','image_url','imageUrl','Image','image','Photo','photo','Picture','picture','Thumbnail','thumbnail','Logo','logo','Img','img','Avatar','avatar'];
          container.innerHTML = result.data.map(function(row, idx) {
            var imgUrl = '';
            for (var i = 0; i < imageKeys.length; i++) { if (row[imageKeys[i]]) { imgUrl = row[imageKeys[i]]; break; } }
            var imgHtml = imgUrl ? '<img src="' + imgUrl + '" alt="' + (row.Name || row.name || '') + '" loading="lazy" style="width:100%;height:240px;object-fit:cover;display:block;" onerror="this.style.display=\'none\'">' : '<div style="height:240px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:3rem;">📷</div>';
            var name = row.Name || row.name || 'Item';
            var desc = row.Description || row.description || '';
            var price = row.Price || row.price || '';
            if (price && !isNaN(price)) price = '$' + parseFloat(price).toFixed(2);
            var cat = row.Category || row.category || '';
            return '<div class="menu-item" style="animation-delay:' + (idx * 0.1) + 's">' +
              '<div class="menu-card rounded-3xl overflow-hidden bg-white shadow-lg shadow-black/5 ring-1 ring-slate-200">' +
              imgHtml +
              '<div class="menu-card-content p-5">' +
              (cat ? '<span style="display:inline-block;background:#fee2e2;color:#dc2626;font-size:0.75rem;font-weight:700;padding:2px 10px;border-radius:9999px;margin-bottom:8px;">' + cat + '</span>' : '') +
              '<h4 class="mt-2 text-lg font-extrabold text-slate-900">' + name + '</h4>' +
              '<p class="mt-2 text-sm leading-6 text-slate-600">' + desc + '</p>' +
              (price ? '<div class="menu-card-price mt-4 text-base font-black text-[#123c2f]">' + price + '</div>' : '') +
              '</div></div></div>';
          }).join('');
        })
        .catch(function(err) {
          console.error('Sheet data error:', err);
          if (errorDiv) errorDiv.classList.remove('hidden');
        });
    })();