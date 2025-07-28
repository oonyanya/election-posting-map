<template>
  <div class="text_view">
    <h1>選挙マップ</h1>
    <p>他の端末で前の状態を復元するにはマップをクリックし、「復元する」を押してください。同じ端末であれば、「復元をする」を押さなくても前の状態に復元できます。なお、前に開いたのと別のマップを開くと、処理状況が上書きされてしまうことがあります。別のマップを開く前に「コピー」を押してメモ帳などに保存してください。」</p>
    <RouterLink :to="{path:'/map', query:{restore_state:'true'} }">マップ</RouterLink>
    <h2>埼玉県</h2>
    <ul>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_chuou',type:'kml' }}">さいたま市中央区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_iwatsuki',type:'kml' }}">さいたま市岩槻区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_kita',type:'kml' }}">さいたま市北区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_midori',type:'kml' }}">さいたま市緑区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_minami',type:'kml' }}">さいたま市南区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_minuma',type:'kml' }}">さいたま市見沼区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_nishi',type:'kml' }}">さいたま市西区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_oomiya',type:'kml' }}">さいたま市大宮区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_sakura',type:'kml' }}">さいたま市桜区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_urawa',type:'kml' }}">さいたま市浦和区</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'ageo',type:'kml' }}">上尾市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'arashiyamachou',type:'kml' }}">嵐山町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'asaka',type:'kml' }}">朝霞市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'chichibu',type:'kml' }}">秩父市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'fukaya',type:'kml' }}">深谷市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'fuzimi',type:'kml' }}">富士見市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'fuzimino',type:'kml' }}">ふじみ野市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'gyouda',type:'kml' }}">行田市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'hanou',type:'kml' }}">飯能市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'hanyu',type:'kml' }}">羽生市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'ha:toyamachou',type:'kml' }}">鳩山町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'hidaka',type:'kml' }}">日高市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'higashichichibumura',type:'kml' }}">東秩父村</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'higashimatsuyama',type:'kml' }}">東松山市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'hozyou',type:'kml' }}">本庄市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'iruma',type:'kml' }}">入間市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kamikawachou',type:'kml' }}">神川町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kamisa:tochou',type:'kml' }}">上里町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kasukabe',type:'kml' }}">春日部市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kawagoe',type:'kml' }}">川越市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kawaguchi',type:'kml' }}">川口市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kawashimachou',type:'kml' }}">神島町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kitamo:to',type:'kml' }}">北本市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'koshigaya',type:'kml' }}">越谷市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kounosu',type:'json' }}">鴻巣市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kuamagaya',type:'kml' }}">熊谷市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'kuki',type:'kml' }}">久喜市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'matsubushi',type:'kml' }}">松伏町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'minanochou',type:'kml' }}">皆野町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'misa:to',type:'kml' }}">三郷市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'misa:tochou',type:'kml' }}">美里町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'miyashirochou',type:'kml' }}">宮代町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'miyoshichou',type:'kml' }}">芳川町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'moroyamachou',type:'kml' }}">毛呂山町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'namekawachou',type:'kml' }}">滑川町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'nieiza',type:'kml' }}">新座市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'oganomachi',type:'kml' }}">小鹿野町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'ogose',type:'kml' }}">越生町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'ogawachou',type:'kml' }}">小川町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'okegawa',type:'kml' }}">桶川市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'sakado',type:'kml' }}">坂戸市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'satteshi',type:'kml' }}">幸手市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'sayama',type:'kml' }}">狭山市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'siraoka',type:'kml' }}">白岡市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'souka',type:'kml' }}">草加市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'sugi:tochou',type:'kml' }}">杉戸町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'toda',type:'kml' }}">戸田市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'tokigawachou',type:'kml' }}">ときがわ町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'tokorozawa',type:'kml' }}">所沢市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'tsurugashima',type:'kml' }}">鶴ヶ島市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'wakou',type:'kml' }}">和光市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'warabi',type:'kml' }}">蕨市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'yashio',type:'kml' }}">八潮市</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'yokosechou',type:'kml' }}">横瀬町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'yoriichou',type:'kml' }}">寄居町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'yoshikawa',type:'kml' }}">芳川町</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'yoshimichou',type:'kml' }}">吉見町</RouterLink>
      </li>
    </ul>
  </div>
</template>
