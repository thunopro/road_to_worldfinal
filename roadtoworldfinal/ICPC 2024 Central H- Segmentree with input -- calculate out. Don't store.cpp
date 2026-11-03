#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
#define left id<<1
#define right id<<1|1 
#define re exit(0); 
#define _lower(x) lower_bound(v.begin(),v.end(),x)-v.begin()+1 
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 1e9+7;
const int INF = 1e9+2; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T> void chkmin (T &a , T b) {if (a > b) a = b;} 
template <typename T> void chkmax (T &a , T b) {if (a < b) a = b;} 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow(int a, int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 200009

int n,nq; 
int a[maxn]; 
int wash[maxn]; 

struct shape{
    int sum[16] = {0}; 
    int a[16] = {0}; // output value if input is i 
}; 

shape T[maxn*4]; 

shape merge (shape L, shape R) 
{
    shape res; 
    for (int i = 0; i <= 15; i ++) 
    {
        res.sum[i] = L.sum[i] + R.sum[L.a[i]]; 
        res.a[i] = R.a[L.a[i]]; 
    }
    return res; 
}
void build (int id, int l, int r) 
{
    if (l == r) 
    {
        for (int i = 0; i <= 15; i ++) 
        {
            T[id].sum[i] = max(0ll,i-a[l]); 
            T[id].a[i] = max(i,a[l]); 
        }
        return; 
    }
    build(left,l,mid); build(right,mid+1,r); 
    T[id] = merge(T[left],T[right]); 
}

void update (int id, int l, int r, int pos) 
{
    if (l > pos || r < pos) return; 
    if (l == r) 
    {
        for (int i = 0; i <= 15; i ++) 
        {
            T[id].sum[i] = max(0ll,i-a[l]); 
            T[id].a[i] = max(i,a[l]); 
            if (wash[l] == true) T[id].a[i] = 0; 
        }
        return; 
    }
    update(left,l,mid,pos); update(right,mid+1,r,pos); 
    T[id] = merge(T[left],T[right]); 
}
shape Empty; 
void get (int id, int l, int r, int u, int v, int &answer, int &IN) 
{
    if (l > v || r < u) return; 
    if (u <= l && r <= v) 
    {
        answer += T[id].sum[IN]; 
        IN = T[id].a[IN]; 
        return; 
    }
    get(left,l,mid,u,v,answer,IN); 
    get(right,mid+1,r,u,v,answer,IN); 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> nq; 
    for (int i = 1; i <= n; i ++) cin >> a[i]; 
    build (1,1,n); 
    while (nq --) 
    {
        int type,pos,x,l,r; cin >> type; 
        if (type == 1) 
        {
            cin >> pos >> x; 
            a[pos] = x; 
            update (1,1,n,pos); 
        }
        else if (type == 2) 
        {
            cin >> pos; 
            wash[pos] = true; 
            update(1,1,n,pos); 
        }
        else 
        {
            cin >> l >> r; 
            int answer = 0;
            int IN = 0; 
            get(1,1,n,l,r,answer,IN); 
            cout << answer << "\n"; 
        }
    }
    return 0;
}
